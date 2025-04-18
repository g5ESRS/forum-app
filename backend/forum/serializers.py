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

        
class TopicSerializer(serializers.ModelSerializer):

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

    class Meta:
        model = Topic
        fields = [
            'id', 'title', 'content', 'author',
            'category', 'category_ref',
            'tags', 'tag_refs',
            'pinned', 'closed', 'views',
            'last_activity', 'created_at', 'updated_at',
            'posts'
        ]
        read_only_fields = [
            'author', 'views', 'created_at', 'updated_at',
            'last_activity', 'pinned', 'closed',
            'posts'
        ]


