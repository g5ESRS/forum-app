from rest_framework import serializers
from forum.models import Topic, Tag, Category,Post
from core.serializers import FlexibleSlugOrIdField


class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for the Category model.
    """
    class Meta:
        model = Category
        fields = '__all__'


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']


class PostSerializer(serializers.ModelSerializer):
    topic = serializers.PrimaryKeyRelatedField(
        queryset=Topic.objects.all()
    )

    class Meta:
        model = Post
        fields = ['id', 'content', 'topic', 'author', 'created_at']
        read_only_fields = ['author', 'created_at']

        
class TopicListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing topics.
    """
    #reply_count = serializers.SerializerMethodField()
    #last_activity = serializers.DateTimeField(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    author = serializers.PrimaryKeyRelatedField(read_only=True) 
    content = serializers.SerializerMethodField()
    reply_count = serializers.SerializerMethodField()


    class Meta:
        model = Topic
        fields = [
            'id', 'title', 'content',  # include a short preview of content
            'author', 'category', 'tags',
            'reply_count','pinned','closed',
            'created_at'
        ]


    def get_content(self, obj):
        # Return the first 100 characters of the content as a preview
        return obj.content[:100] + '...' if len(obj.content) > 100 else obj.content

    def get_reply_count(self, obj):
        return obj.posts.count()


class TopicDetailSerializer(serializers.ModelSerializer):

    # Read-only nested representations
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    posts = PostSerializer(many=True, read_only=True)

    # Write-only inputs using slug or ID
    category_ref = FlexibleSlugOrIdField(
        slug_field='slug',
        source='category',
        queryset=Category.objects.all(),
        write_only=True
    )
    tag_refs = FlexibleSlugOrIdField(
        many=True,
        slug_field='slug',
        source='tags',
        queryset=Tag.objects.all(),
        write_only=True,
        required=False
    )
    
    # Add tag_names field to handle automatic tag creation
    tag_names = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False,
        default=[]
    )

    class Meta:
        model = Topic
        fields = [
            'id', 'title', 'content', 'author',
            'category', 'category_ref',
            'tags', 'tag_refs', 'tag_names',
            'pinned', 'closed', 'views',
            'last_activity', 'created_at', 'updated_at',
            'posts'
        ]
        read_only_fields = [
            'author', 'views', 'created_at', 'updated_at',
            'last_activity',
            'posts'
        ]

    def create(self, validated_data):
        # Remove tag_names from validated_data before creating the Topic
        tag_names = validated_data.pop('tag_names', [])
        
        # Create the Topic instance
        topic = super().create(validated_data)
        
        # Process tag names and associate tags with the topic
        if tag_names:
            tags_to_add = []
            for name in tag_names:
                tag_obj, created = Tag.objects.get_or_create(
                    slug=name,
                    defaults={'name': name}
                )
                tags_to_add.append(tag_obj)
            
            # Add all tags to the topic
            topic.tags.add(*tags_to_add)
        
        return topic


