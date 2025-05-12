from .settings import *

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'dev_temp.sqlite3',  # Or use os.path.join(BASE_DIR, ...)
    }
}
