# config/settings_test.py
from config.settings import *  # Import everything from main settings

# Override only the database settings for testing
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",  # In-memory SQLite for faster tests
    }
}

# Optionally override other test-specific settings
DEBUG = True  # Disable debug mode for tests
PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]  # Faster password hashing
EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"  # Prevent sending real emails
