# 📝 Forum API

## Features
- Automatic permission assignment for new users (topic-create and post-create)
- Topic summaries with reply counts in list views (for performance)
- Topic pinning and closing functionality
- Dynamic tag creation
- Category-based topic filtering

## Endpoints

### Categories

| # | Endpoint | HTTP Method | Description | Query params | Auth |
|---|----------|------------|-------------|--------------|------|
| 1 | `{{BASE_URL}}categories/` | **GET** | List all categories | — | No |
|   |  | **POST** | Create a new category | — | ✅ |
| 2 | `{{BASE_URL}}categories/<pk>/` | **PATCH** | Update a category | — | ✅ |
|   |  | **DELETE** | Delete a category | — | ✅ |

### Topics

| # | Endpoint | HTTP Method | Description | Query params | Auth |
|---|----------|------------|-------------|--------------|------|
| 1 | `{{BASE_URL}}topics/` | **GET** | List topics with summaries (no posts list) | `?category=<id_or_slug>` — filter by category | No |
|   |  | **POST** | Create a new topic | — | ✅ |
| 2 | `{{BASE_URL}}topics/<pk>/` | **GET** | Get detailed topic info including posts | — | No |
|   |  | **PATCH** | Update a topic (title, content, category, tags) | — | ✅ |
|   |  | **PATCH** | Pin a topic `{"pinned": true}` | — | ✅ |
|   |  | **PATCH** | Close a topic `{"closed": true}` | — | ✅ |
|   |  | **DELETE** | Delete a topic | — | ✅ |

### Posts

| # | Endpoint | HTTP Method | Description | Query params | Auth |
|---|----------|------------|-------------|--------------|------|
| 1 | `{{BASE_URL}}posts/` | **POST** | Create a new post (reply) | — | ✅ |

### Tags

| # | Endpoint | HTTP Method | Description | Query params | Auth |
|---|----------|------------|-------------|--------------|------|
| 1 | `{{BASE_URL}}tags/` | **GET** | List all tags | — | No |
| 2 | `{{BASE_URL}}tags/<slug>/` | **GET** | Get a specific tag | — | No |

## Data Models

### Topic
- Topics contain a title, content, author, category, and tags
- Topics can be pinned and closed
- Topics track view count and last activity time
- Topics include a reply count in list view

### Post
- Posts are replies to topics
- Posts cannot be added to closed topics
- Each post updates the parent topic's last activity time

### Category
- Categories organize topics
- Topics can be filtered by category

### Tag
- Tags can be associated with topics
- Tags are automatically created when a topic is created with `tag_names`

## Recent Updates
- Automatically assign topic-create and post-create permissions to users upon registration
- Added reply_count to topic list output
- Implemented functionality to pin and close topics
- Disallowed posting to closed topics
- Updated `/topics/` to return only topic summaries (no post list) for performance
- Removed `GET /posts/` list endpoint for clarity and optimization
- Added endpoint to list topics under a specific category
- Enhanced topic serializer to include number of posts and last update time
- Tags are now automatically created when a topic is created
- Added `/tags/` endpoint to list all tags
