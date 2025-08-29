# OwnerRez API v2.0 Documentation

## Overview
The OwnerRez API v2.0 provides comprehensive access to property management functionality including bookings, guests, properties, and more.

**Base URL:** `https://api.ownerrez.com/`

---

## Authentication
All API requests require proper authentication. Contact OwnerRez support for API access credentials.

---

## Endpoints

### Bookings
Fetch and modify the details of bookings and blocks.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `v2/bookings` | Query for a pageable list of bookings |
| `POST` | `v2/bookings` | Create a new booking |
| `GET` | `v2/bookings/{id}` | Fetch a single booking record |
| `PATCH` | `v2/bookings/{id}` | Update a booking record |

**Query Parameters for GET v2/bookings:**
- `property_ids` (required) - Comma-separated list of property IDs
- `status` - Filter by booking status
- `include_door_codes` - Include door code information
- `include_charges` - Include charge details
- `include_tags` - Include tag information
- `include_fields` - Include custom fields
- `include_guest` - Include guest details
- `include_cancellation_policy` - Include cancellation policy
- `include_agreements` - Include agreement details
- `from` - Start date filter
- `to` - End date filter
- `since_utc` - Filter by creation date (alternative to property_ids)

---

### FieldDefinitions
Fetch and modify custom field definitions.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `v2/fielddefinitions` | Fetch all possible field definitions |
| `POST` | `v2/fielddefinitions` | Create a new field definition |
| `GET` | `v2/fielddefinitions/{id}` | Fetch a single field definition |
| `PATCH` | `v2/fielddefinitions/{id}` | Update a field definition |
| `DELETE` | `v2/fielddefinitions/{id}` | Remove a field definition |

**Query Parameters for GET v2/fielddefinitions:**
- `type` - Filter by field type
- `active` - Filter by active status

---

### Fields
Fetch and modify custom field values for various entities.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `v2/fields` | Fetch all field values for a single entity |
| `POST` | `v2/fields` | Create a new field value |
| `GET` | `v2/fields/{id}` | Fetch a single field record |
| `PATCH` | `v2/fields/{id}` | Update a field record |
| `DELETE` | `v2/fields/{id}` | Remove a field record |
| `DELETE` | `v2/fields/bydefinition` | Remove a specific field definition from an entity |

**Query Parameters for GET v2/fields:**
- `entity_id` - The ID of the entity
- `entity_type` - The type of entity

**Query Parameters for DELETE v2/fields/bydefinition:**
- `field_definition_id` - The field definition ID to remove
- `entity_id` - The entity ID
- `entity_type` - The entity type

---

### Guests
Fetch and modify guest records and contact info.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `v2/guests` | Query for a pageable list of guests |
| `POST` | `v2/guests` | Create a new guest record |
| `GET` | `v2/guests/{id}` | Fetch a single guest record |
| `PATCH` | `v2/guests/{id}` | Update a guest record |
| `DELETE` | `v2/guests/{id}` | Remove a guest record |
| `DELETE` | `v2/guests/{id}/addresses/{address_id}` | Remove a single address |
| `DELETE` | `v2/guests/{id}/emailaddresses/{email_address_id}` | Remove a single email address |
| `DELETE` | `v2/guests/{id}/phones/{phone_id}` | Remove a single phone number |

**Query Parameters for GET v2/guests:**
- `q` (required) - Search query string
- `include_tags` - Include tag information
- `include_fields` - Include custom fields
- `created_since_utc` - Filter by creation date (alternative to q)
- `from` - Start date filter
- `to` - End date filter

---

### Inquiries
Fetch and modify inquiry records.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `v2/inquiries` | Fetch all inquiry records |
| `GET` | `v2/inquiries/{id}` | Fetch a single inquiry record |

**Query Parameters for GET v2/inquiries:**
- `property_ids` - Comma-separated list of property IDs
- `include_tags` - Include tag information
- `include_guest` - Include guest details
- `since_utc` - Filter by creation date

---

### Listings
Fetch listing content for properties.

> **Note:** The WordPress Plugin + Integrated Websites premium feature must be enabled to access these endpoints.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `v2/listings` | Query for a pageable list of property listings |
| `GET` | `v2/listings/{id}` | Fetch a single listing record |

**Query Parameters for GET v2/listings:**
- `includeAmenities` - Include amenity information
- `includeRooms` - Include room details
- `includeBathrooms` - Include bathroom information
- `includeImages` - Include image data
- `includeDescriptions` - Include description content

**Query Parameters for GET v2/listings/{id}:**
- `descriptionFormat` - Format for description content

---

### Messages
Fetch and create message records.

> **Note:** Messaging agreements must be signed to access the Messages endpoints. Contact help@ownerrez.com with subject "Messaging API Access".

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `v2/messages` | Fetch all records on a single thread |
| `POST` | `v2/messages` | Create a new message |
| `GET` | `v2/messages/{id}` | Fetch a single message record |

**Query Parameters for GET v2/messages:**
- `threadId` - The message thread ID
- `include_drafts` - Include draft messages
- `since_utc` - Filter by creation date

---

### Owners
Fetch and modify owner records.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `v2/owners` | Fetch all owner records |
| `GET` | `v2/owners/{id}` | Fetch a single owner record |

**Query Parameters for GET v2/owners:**
- `active` - Filter by active status
- `include_tags` - Include tag information
- `include_fields` - Include custom fields

---

### Properties
Fetch and modify property records.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `v2/properties` | Fetch many properties |
| `GET` | `v2/properties/{id}` | Fetch a single property record |

**Query Parameters for GET v2/properties:**
- `payment_method_id` - Filter by payment method
- `active` - Filter by active status
- `include_tags` - Include tag information
- `include_fields` - Include custom fields
- `include_listing_numbers` - Include listing numbers
- `availability_start_date` - Filter by availability start date
- `availability_end_date` - Filter by availability end date

---

### PropertySearch
Search properties with advanced filtering.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `v2/propertysearch` | Search for properties |

**Query Parameters for GET v2/propertysearch:**
- `property_ids` - Comma-separated list of property IDs
- `guests_min` - Minimum number of guests
- `guests_max` - Maximum number of guests
- `pets_allowed` - Filter by pet allowance
- `children_allowed` - Filter by children allowance
- `bedrooms_min` - Minimum number of bedrooms
- `bedrooms_max` - Maximum number of bedrooms
- `rate_min` - Minimum rate
- `rate_max` - Maximum rate
- `include_tag_ids[0]` - Include tags (array format)
- `include_tag_ids[1]` - Additional include tags
- `exclude_tag_ids[0]` - Exclude tags (array format)
- `exclude_tag_ids[1]` - Additional exclude tags
- `evaluate_rules` - Evaluate property rules
- `available_from` - Available from date
- `available_to` - Available to date

---

### Quotes
Fetch and modify quote records.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `v2/quotes` | Fetch all quote records |
| `GET` | `v2/quotes/{id}` | Fetch a single quote record |

**Query Parameters for GET v2/quotes:**
- `property_ids` - Comma-separated list of property IDs
- `include_tags` - Include tag information
- `include_guest` - Include guest details
- `since_utc` - Filter by creation date

---

### Reviews
Fetch review content for properties.

> **Note:** The WordPress Plugin + Integrated Websites premium feature must be enabled to access these endpoints.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `v2/reviews` | Get a page of reviews |
| `GET` | `v2/reviews/{id}` | Fetch a single review record |

**Query Parameters for GET v2/reviews:**
- `property_id` - The property ID
- `active` - Filter by active status
- `host_review` - Filter by host review status
- `include_guest` - Include guest details
- `since_utc` - Filter by creation date

---

### SpotRates
Fetch and modify custom rate records.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `PATCH` | `v2/spotrates` | Create and/or partially update multiple records |

---

### TagDefinitions
Fetch and modify tag definitions.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `v2/tagdefinitions` | Fetch a pageable list of all possible tags |
| `POST` | `v2/tagdefinitions` | Create a new tag definition |
| `GET` | `v2/tagdefinitions/{id}` | Fetch a single tag definition |
| `PATCH` | `v2/tagdefinitions/{id}` | Update a tag definition |
| `DELETE` | `v2/tagdefinitions/{id}` | Remove a tag definition |

**Query Parameters for GET v2/tagdefinitions:**
- `active` - Filter by active status

---

### Tags
Fetch and modify tag records.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `v2/tags` | Fetch all tags applied to a single entity |
| `POST` | `v2/tags` | Add a tag to an entity |
| `GET` | `v2/tags/{id}` | Fetch a single tag record |
| `DELETE` | `v2/tags/{id}` | Remove a tag record |
| `DELETE` | `v2/tags/byname` | Remove a specific tag name from an entity |

**Query Parameters for GET v2/tags:**
- `entity_id` - The entity ID
- `entity_type` - The entity type

**Query Parameters for DELETE v2/tags/byname:**
- `name` - The tag name to remove
- `entity_id` - The entity ID
- `entity_type` - The entity type

---

### Users
Fetch and modify the authenticated user account record.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `v2/users/me` | Fetch the user details for the currently authenticated user |

---

### WebhookSubscriptions
Fetch and modify webhook subscriptions for the authenticated API application connection.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `v2/webhooksubscriptions` | Fetch all webhook subscriptions |
| `POST` | `v2/webhooksubscriptions` | Create a new webhook subscription |
| `GET` | `v2/webhooksubscriptions/{id}` | Fetch a single webhook subscription |
| `DELETE` | `v2/webhooksubscriptions/{id}` | Remove a webhook subscription |
| `GET` | `v2/webhooksubscriptions/categories` | Fetch all webhook categories |

---

## Rate Limiting
Please refer to OwnerRez documentation for current rate limiting policies.

## Error Handling
The API returns standard HTTP status codes:
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Support
For API access and support, contact OwnerRez at help@ownerrez.com.

---

*Last updated: API v2.0*
