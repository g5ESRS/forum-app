from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify

User = get_user_model()


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    slug = models.SlugField(unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=30, unique=True)
    slug = models.SlugField(max_length=40, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    # Optional: to create a URL for the tag
    # def get_absolute_url(self):
    #     return reverse("tag-detail", kwargs={"slug": self.slug})

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class Topic(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    author = models.ForeignKey(
        User, on_delete=models.SET_NULL,null=True ,related_name='topics')
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, related_name='topics')
    tags = models.ManyToManyField(Tag, blank=True, related_name='topics')
    #file = models.FileField(upload_to='attachments/')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    pinned = models.BooleanField(default=False)
    closed = models.BooleanField(default=False)
    views = models.PositiveIntegerField(default=0)

    last_activity = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-pinned', '-last_activity', '-created_at']

    def __str__(self):
        return self.title


class Post(models.Model):
    topic = models.ForeignKey(Topic, related_name="posts", on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    quoted_post = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.author} on {self.topic}"