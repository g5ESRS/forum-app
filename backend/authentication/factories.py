import factory
from factory.django import DjangoModelFactory
from django.contrib.auth import get_user_model

class UserFactory(DjangoModelFactory):
    class Meta:
        model = get_user_model()
        skip_postgeneration_save = True  

    
    username = factory.Faker('user_name')
    email = factory.Faker('email')
    password = factory.PostGenerationMethodCall('set_password', 'defaultpassword')

    @factory.post_generation
    def save_after_postgen(self, create, extracted, **kwargs):
        # Do something post-creation
        if create:
            self.save()