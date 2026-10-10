# SnapShare: Photo App Scaling Plan

## 1. Assumptions

SnapShare is a photo-sharing application where users upload photos and view a feed containing photos from people they follow.

The following assumptions are used for the estimates:

- Registered users: 10,000,000.
- Daily active users (DAU): 10% of registered users.
- Each active user uploads 1 photo per day.
- Each active user views 50 feed pages per day.
- Each original photo is 2 MB, and each thumbnail is 50 KB.
- A year contains 365 days.
- Traffic is distributed across 24 hours for average-rate calculations.
- Peak traffic is five times the average rate.
- Each uploaded photo generates one thumbnail.
- Storage estimates exclude replication overhead, backups, logs, and additional image sizes.

## 2. Traffic and Storage Estimates

### Daily active users

Daily active users are 10% of 10 million registered users:

10,000,000 × 0.10 = **1,000,000 daily active users**.

### Photo uploads per second

Each active user uploads one photo per day:

1,000,000 × 1 = **1,000,000 uploads per day**.

Average uploads per second:

1,000,000 ÷ 86,400 ≈ **11.6 uploads per second**.

### Feed views per second

Each active user views 50 feed pages per day:

1,000,000 × 50 = **50,000,000 feed views per day**.

Average feed views per second:

50,000,000 ÷ 86,400 ≈ **579 feed views per second**.

Peak feed views per second, using a factor of five:

579 × 5 ≈ **2,894 feed views per second**.

For comparison, peak uploads would be approximately 58 uploads per second if uploads follow the same five-times-peak assumption.

### Photo storage per year

Original photos uploaded per year:

1,000,000 × 365 = **365,000,000 photos**.

Original photo storage:

365,000,000 × 2 MB = **730,000,000 MB**, approximately **730 TB per year** using decimal units.

Thumbnail storage:

365,000,000 × 50 KB = **18,250,000,000 KB**, approximately **18.25 TB per year**.

Total storage for original photos and thumbnails is approximately **748.25 TB per year**, before replication, backups, and other overhead.

## 3. Read-Heavy or Write-Heavy?

SnapShare is a **read-heavy system** because users view 50 feed pages per day but upload only one photo per day. Feed views occur far more frequently than uploads.

The design should therefore prioritize fast feed delivery, caching, database read replicas, and a CDN. Uploads should also be handled efficiently, while thumbnail generation should run asynchronously so that image processing does not slow down the upload request.

## 4. Why Photos Should Not Be Stored in the Database

Photo files should be stored in **object storage**, while the database stores metadata such as photo ID, owner, upload time, object-storage key, and thumbnail location.

Storing large binary files directly in the database would increase database size, backups, and operational costs. Object storage is designed to store large files durably and scale independently, while the database remains focused on structured data and relationships.

## 5. Architecture Diagram

```text
                         USERS
                           |
                           v
                    +--------------+
                    |     CDN      |
                    | Cached photos|
                    +--------------+
                           |
                           v
                    +--------------+
                    |Load Balancer |
                    +--------------+
                           |
              +------------+------------+
              |            |            |
              v            v            v
        +-----------+ +-----------+ +-----------+
        | App       | | App       | | App       |
        | Server 1  | | Server 2  | | Server 3  |
        +-----------+ +-----------+ +-----------+
              |            |            |
              +------------+------------+
                           |
                +----------+----------+
                |                     |
                v                     v
          +-----------+         +-----------+
          |   Cache   |         |  Primary  |
          | Feed data |         | Database  |
          +-----------+         +-----------+
                                      |
                                      v
                                +-----------+
                                | Read      |
                                | Replica   |
                                +-----------+

 Photo upload and metadata path:

 App Server -----> Object Storage
      |
      +----------> Queue ---------> Thumbnail Worker
                                      |
                                      v
                                Object Storage
                                (thumbnails)

 CDN ----------------------------> Object Storage
                  Cache miss: fetch photo
```

## 6. What Each Component Does

- **CDN:** Delivers frequently accessed photos from locations closer to users, reducing latency and load on the origin storage.
- **Load balancer:** Distributes incoming requests across healthy app servers so that one server does not become a bottleneck.
- **App servers:** Handle authentication, photo-upload requests, feed generation, follow relationships, and application business logic.
- **Cache:** Keeps frequently requested feed data and other reusable information in fast memory to reduce database queries.
- **Primary database:** Stores authoritative structured information such as users, follows, photo metadata, and feed-related records.
- **Read replica:** Serves eligible read queries to reduce pressure on the primary database.
- **Object storage:** Stores original photos and generated thumbnails separately from the database, scaling to large volumes of files.
- **Queue:** Holds thumbnail-generation jobs so image processing can happen asynchronously and failed jobs can be retried.
- **Thumbnail worker:** Processes queued jobs, creates smaller versions of uploaded photos, and saves them to object storage.

## 7. Photo Upload Flow

1. A user selects a photo and submits it through the application.
2. The app server authenticates the user and validates the upload, including file type and size.
3. The photo is uploaded to object storage, where it receives a unique object key.
4. The app server records the photo's metadata and storage key in the primary database.
5. The app server places a thumbnail-generation job on the queue.
6. The app server returns an upload confirmation to the user. The thumbnail may still be processing.
7. A thumbnail worker retrieves the job from the queue and reads the original photo from object storage.
8. The worker creates a 50 KB thumbnail and stores it in object storage.
9. The worker updates the photo metadata to indicate that the thumbnail is ready.
10. When users view the photo, the application provides the relevant image URL, and the CDN serves the cached image or retrieves it from object storage on a cache miss.

## 8. Trade-Offs

### Cache speed versus data freshness

Caching feed data improves response times and reduces database load, but cached results can become stale when someone uploads a new photo or changes their follow relationships. Cache expiration and invalidation improve freshness but add complexity.

### Asynchronous thumbnails versus immediate availability

Using a queue keeps uploads responsive and allows thumbnail jobs to be retried, but thumbnails are not available immediately. The application must handle a pending thumbnail state and possible processing failures.

### Read replicas versus consistency

Read replicas reduce the load on the primary database, but replication lag can cause users to see slightly outdated information. Critical operations may need to read from the primary database.

### Object storage and CDN versus cost and complexity

Object storage and a CDN scale well for large photo libraries and frequent image delivery, but they introduce additional services, configuration, access-control requirements, and storage or bandwidth costs.

## Conclusion

SnapShare should use a horizontally scalable application tier, object storage for photo files, asynchronous thumbnail processing, caching, a CDN, and a primary database with a read replica. Since feed views greatly outnumber uploads, the architecture prioritizes read performance while keeping uploads reliable and image processing separate from user-facing requests.