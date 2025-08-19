# REST API Documentation - API v2.0

## Introduction

The root domain for all endpoints is `https://api.ownerrez.com/`.

---

## Bookings

Fetch and modify the details of bookings and blocks.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `v2/bookings` | Query for a pageable list of bookings. Either `property_ids` or `since_utc` is required. |
| POST | `v2/bookings` | Create a new booking |
| GET | `v2/bookings/{id}` | Fetch a single record |
| PATCH | `v2/bookings/{id}` | Update a booking record |

### Query Parameters for GET v2/bookings

```
?property_ids=1,2,3&status={status}&include_door_codes={include_door_codes}&include_charges={include_charges}&include_tags={include_tags}&include_fields={include_fields}&include_guest={include_guest}&include_cancellation_policy={include_cancellation_policy}&include_agreements={include_agreements}&from={from}&to={to}&since_utc={since_utc}
```

---

## FieldDefinitions

Fetch and modify custom field definitions.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `v2/fielddefinitions` | Fetch all possible field definitions |
| POST | `v2/fielddefinitions` | Create a new field definition |
| GET | `v2/fielddefinitions/{id}` | Fetch a single record |
| PATCH | `v2/fielddefinitions/{id}` | Update a field definition |
| DELETE | `v2/fielddefinitions/{id}` | Remove a single record |

### Query Parameters for GET v2/fielddefinitions

```
?type={type}&active={active}
```

---

## Fields

Fetch and modify custom field values for various entities.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `v2/fields` | Fetch all field values defined for a single entity |
| POST | `v2/fields` | Create a new field value |
| GET | `v2/fields/{id}` | Fetch a single record |
| PATCH | `v2/fields/{id}` | Update a field value |
| DELETE | `v2/fields/{id}` | Remove a single record |
| DELETE | `v2/fields/bydefinition` | Remove a specific field definition from an entity |

### Query Parameters for GET v2/fields

```
?entity_id={entity_id}&entity_type={entity_type}
```

### Query Parameters for DELETE v2/fields/bydefinition

```
?field_definition_id={field_definition_id}&entity_id={entity_id}&entity_type={entity_type}
```

---

## Guests

Fetch and modify guest records and contact info.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `v2/guests` | Query for a pageable list of guests. Either `q` or `created_since_utc` is required |
| POST | `v2/guests` | Create a new guest record |
| GET | `v2/guests/{id}` | Fetch a single record |
| PATCH | `v2/guests/{id}` | Update a guest record |
| DELETE | `v2/guests/{id}` | Remove a single record |
| DELETE | `v2/guests/{id}/addresses/{address_id}` | Remove a single address from a guest record |
| DELETE | `v2/guests/{id}/emailaddresses/{email_address_id}` | Remove a single email address from a guest record |
| DELETE | `v2/guests/{id}/phones/{phone_id}` | Remove a single phone number from a guest record |

### Query Parameters for GET v2/guests

```
?q={q}&include_tags={include_tags}&include_fields={include_fields}&created_since_utc={created_since_utc}&from={from}&to={to}
```

---

## Inquiries

Fetch and modify inquiry records.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `v2/inquiries` | Fetch all inquiry records |
| GET | `v2/inquiries/{id}` | Fetch a single record |

### Query Parameters for GET v2/inquiries

```
?property_ids=1,2,3&include_tags={include_tags}&include_guest={include_guest}&since_utc={since_utc}
```

---

## Listings

Fetch listing content for properties.

> **Note:** The WordPress Plugin + Integrated Websites premium feature must be enabled to access these endpoints.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `v2/listings` | Query for a pageable list of property listings |
| GET | `v2/listings/{id}` | Fetch a single record |

### Query Parameters for GET v2/listings

```
?includeAmenities={includeAmenities}&includeRooms={includeRooms}&includeBathrooms={includeBathrooms}&includeImages={includeImages}&includeDescriptions={includeDescriptions}
```

### Query Parameters for GET v2/listings/{id}

```
?descriptionFormat={descriptionFormat}
```

---

## Messages

Fetch and create message records.

> **Note:** Messaging agreements must be signed to access the Messages endpoints. To gain access, email help@ownerrez.com with the subject line "Messaging API Access".

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `v2/messages` | Fetch all records on a single thread |
| POST | `v2/messages` | Create a new message |
| GET | `v2/messages/{id}` | Fetch a single record |

### Query Parameters for GET v2/messages

```
?threadId={threadId}&include_drafts={include_drafts}&since_utc={since_utc}
```

---

## Owners

Fetch and modify owner records.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `v2/owners` | Fetch all owner records |
| GET | `v2/owners/{id}` | Fetch a single record |

### Query Parameters for GET v2/owners

```
?active={active}&include_tags={include_tags}&include_fields={include_fields}
```

---

## Properties

Fetch and modify property records.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `v2/properties` | Fetch many properties |
| GET | `v2/properties/{id}` | Fetch a single record |

### Query Parameters for GET v2/properties

```
?payment_method_id={payment_method_id}&active={active}&include_tags={include_tags}&include_fields={include_fields}&include_listing_numbers={include_listing_numbers}&availability_start_date={availability_start_date}&availability_end_date={availability_end_date}
```

---

## PropertySearch

Search properties.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `v2/propertysearch` | Search for properties |

### Query Parameters for GET v2/propertysearch

```
?property_ids=1,2,3&guests_min={guests_min}&guests_max={guests_max}&pets_allowed={pets_allowed}&children_allowed={children_allowed}&bedrooms_min={bedrooms_min}&bedrooms_max={bedrooms_max}&rate_min={rate_min}&rate_max={rate_max}&include_tag_ids[0]={include_tag_ids[0]}&include_tag_ids[1]={include_tag_ids[1]}&exclude_tag_ids[0]={exclude_tag_ids[0]}&exclude_tag_ids[1]={exclude_tag_ids[1]}&evaluate_rules={evaluate_rules}&available_from={available_from}&available_to={available_to}
```

---

## Quotes

Fetch and modify quote records.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `v2/quotes` | Fetch all quote records |
| GET | `v2/quotes/{id}` | Fetch a single record |

### Query Parameters for GET v2/quotes

```
?property_ids=1,2,3&include_tags={include_tags}&include_guest={include_guest}&since_utc={since_utc}
```

---

## Reviews

Fetch review content for properties.

> **Note:** The WordPress Plugin + Integrated Websites premium feature must be enabled to access these endpoints.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `v2/reviews` | Get a page of reviews |
| GET | `v2/reviews/{id}` | Fetch a single record |

### Query Parameters for GET v2/reviews

```
?property_id={property_id}&active={active}&host_review={host_review}&include_guest={include_guest}&since_utc={since_utc}
```

---

## SpotRates

Fetch and modify custom rate records.

| Method | Endpoint | Description |
|--------|----------|-------------|
| PATCH | `v2/spotrates` | Create and/or partially update multiple records |

---

## TagDefinitions

Fetch and modify tag definitions.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `v2/tagdefinitions` | Fetch a pageable list of all possible tags |
| POST | `v2/tagdefinitions` | Create a new tag definition |
| GET | `v2/tagdefinitions/{id}` | Fetch a single record |
| PATCH | `v2/tagdefinitions/{id}` | Update a tag definition |
| DELETE | `v2/tagdefinitions/{id}` | Remove a single record |

### Query Parameters for GET v2/tagdefinitions

```
?active={active}
```

---

## Tags

Fetch and modify tag records.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `v2/tags` | Fetch all tags applied to a single entity |
| POST | `v2/tags` | Add a tag to an entity |
| GET | `v2/tags/{id}` | Fetch a single record |
| DELETE | `v2/tags/{id}` | Remove a single record |
| DELETE | `v2/tags/byname` | Remove a specific tag name from an entity |

### Query Parameters for GET v2/tags

```
?entity_id={entity_id}&entity_type={entity_type}
```

### Query Parameters for DELETE v2/tags/byname

```
?name={name}&entity_id={entity_id}&entity_type={entity_type}
```

---

## Users

Fetch and modify the authenticated user account record.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `v2/users/me` | Fetch the user details for the currently authenticated user |

---

## WebhookSubscriptions

Fetch and modify webhook subscriptions for the authenticated API application connection.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `v2/webhooksubscriptions` | Fetch all webhook subscriptions |
| POST | `v2/webhooksubscriptions` | Create a new webhook subscription |
| GET | `v2/webhooksubscriptions/{id}` | Fetch a single record |
| DELETE | `v2/webhooksubscriptions/{id}` | Remove a single record |
| GET | `v2/webhooksubscriptions/categories` | Fetch all webhook categories |

---

## Authentication

All API requests require proper authentication. Please refer to the authentication documentation for details on how to authenticate your requests.

## Rate Limiting

Please be aware of rate limiting policies when making API requests. Refer to the rate limiting documentation for specific limits and guidelines.

## Error Handling

The API returns standard HTTP status codes and error messages. Refer to the error handling documentation for details on error responses and troubleshooting.
