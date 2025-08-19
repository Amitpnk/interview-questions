# Microservices – Interview Questions

## Fundamentals

## 1. What are microservices and how do they differ from monolithic architecture?

**Microservices** is an architectural style where an application is built as a collection of small, independently deployable services. Each service has its own business functionality, data store, and can be developed, deployed, and scaled independently.

**Monolithic architecture** → entire application is a single deployable unit.

### Example:

**Monolith E-Commerce App**

* Single codebase contains *User Management, Product Catalog, Orders, Payments, Notifications*.
* A small change in one module requires redeployment of the entire application.

**Microservices E-Commerce App**

* Each module is a separate service: *User Service, Product Service, Order Service, Payment Service, Notification Service*.
* They communicate via REST/gRPC or message brokers (RabbitMQ/Kafka).

### Simple Diagram:

```
Monolithic:                     Microservices:
+--------------------------------+     +-----------+   +-----------+   +-----------+
| UI + Business + Data Access    |     | User Svc  |   | Order Svc |   | Payment   |
| (All in one deployment)        |     +-----------+   +-----------+   +-----------+
+--------------------------------+           |               |               |
                                             v               v               v
                                         +-------+       +-------+       +-------+
                                         | DB 1  |       | DB 2  |       | DB 3  |
                                         +-------+       +-------+       +-------+
```

## 2. What are the key benefits of using microservices?

1. **Independent Deployability** – Each service can be deployed without redeploying the whole system.
2. **Scalability** – Services can scale independently based on workload (e.g., scale *Order Service* but not *Notification Service*).
3. **Technology Flexibility** – Different services can use different technologies (e.g., .NET for Payments, Node.js for Notifications).
4. **Fault Isolation** – Failure in one service does not crash the entire application.
5. **Team Autonomy** – Different teams can own different services.

## 3. What challenges do microservices introduce compared to monoliths?

1. **Complex Communication** – Services communicate over the network (REST/gRPC/Message Queue).
2. **Data Management** – Maintaining data consistency across distributed databases is hard.
3. **Deployment Overhead** – Many small services → CI/CD pipelines, orchestration (Kubernetes, Docker).
4. **Monitoring & Debugging** – Requires distributed tracing and centralized logging.
5. **Security** – Each service boundary needs authentication/authorization.

## 4. Can you explain the concept of bounded context in microservices?

**Bounded Context** comes from *Domain-Driven Design (DDD)*. It defines a clear boundary within which a particular domain model is valid.
Each microservice owns a **bounded context** and should not directly interfere with another service’s internal logic or database.

### Example:

* **User Service** → owns concepts like *User, Profile, Roles*.
* **Order Service** → owns concepts like *Order, Cart, PaymentStatus*.
* **Product Service** → owns *Product, Category, Inventory*.

They communicate via APIs/events, not by directly sharing the same database schema.

```
[User Service] ------ API/Event ------ [Order Service] ------ API/Event ------ [Product Service]
   | Users, Roles |                         | Orders, Cart |                        | Products, Stock |
   Own DB (UserDB)                         Own DB (OrderDB)                        Own DB (ProductDB)
```

This ensures **loose coupling** and avoids database-level dependencies.

## 5. What is the role of an API Gateway in a microservices architecture?

An **API Gateway** is the single entry point for all client requests in a microservices system.

### Responsibilities:

1. **Routing** – Routes client requests to appropriate microservice.
2. **Security** – Handles authentication, authorization, and SSL termination.
3. **Aggregation** – Combines data from multiple services before sending response to client.
4. **Rate Limiting & Throttling** – Protects backend services.
5. **Protocol Translation** – Converts between protocols (HTTP ↔ gRPC).

### Example Diagram:

```
Client
   |
   v
+-----------------+
|   API Gateway   |  <-- Authentication, Logging, Routing
+-----------------+
   |       |       |
   v       v       v
User Svc  Order Svc  Payment Svc
```

**Without Gateway:** client calls multiple microservices directly → complexity.
**With Gateway:** client calls only the gateway → gateway forwards request → simpler & secure.


6. What are the pros and cons of **synchronous (REST/gRPC)** vs **asynchronous (message queue/Event Bus)** communication in microservices?
7. When would you choose gRPC over REST in microservices?
8. How do you handle service-to-service communication security?
9. What is service discovery, and how is it typically implemented?


Great — let’s go through each question with **clear explanations, examples, and simple text diagrams**. These are common in microservices interviews.

## Communication

## 6. Pros and Cons of **Synchronous (REST/gRPC)** vs **Asynchronous (Message Queue/Event Bus)**

### **Synchronous (REST/gRPC)**

* **Pros**

  * Simple to implement and understand.
  * Real-time response (client gets immediate result).
  * Good for **query-like operations** (e.g., fetch user details).

* **Cons**

  * Tightly coupled: if a service is down, the request fails.
  * Can increase **latency** if many services are chained.
  * Harder to scale under heavy load.

### **Asynchronous (Message Queue / Event Bus)**

* **Pros**

  * Loosely coupled: sender does not wait for immediate response.
  * Improves scalability and resilience.
  * Suitable for **event-driven workflows** (e.g., order placed → notify inventory → notify shipping).

* **Cons**

  * Higher complexity (message brokers, retries, dead-letter queues).
  * Harder debugging/tracing across async flows.
  * Not suitable when immediate response is required.

### Example Diagram:

```
Synchronous (REST/gRPC):           Asynchronous (Message Queue):
Client --> Order Service --> Payment Service     Client --> Order Service --> [Event Bus] --> Payment Service
(waiting for response)                           (client does not wait, services consume events)
```

---

## 7. When would you choose gRPC over REST in microservices?

**gRPC** (Google Remote Procedure Call) is better than REST in certain scenarios:

* **High-performance inter-service communication** (binary over HTTP/2).
* **Streaming support** (real-time chat, live updates).
* **Strongly typed contracts** (uses Protocol Buffers for schema definition).
* **Language-agnostic** → services in Java, .NET, Go can communicate easily.

**Example use case:**

* REST for **external clients** (e.g., mobile app, web app).
* gRPC for **internal microservice-to-microservice** communication where performance matters (e.g., Order Service ↔ Payment Service).

### Diagram:

```
Client (Web/Mobile) ---> REST API Gateway ---> Services
                                    |
                           gRPC (fast binary)
                                    v
                             Payment Service
```

## 8. How do you handle service-to-service communication security?

In microservices, securing internal communication is crucial. Common strategies:

1. **Mutual TLS (mTLS)**

   * Each service has a certificate.
   * Both client and server authenticate each other.

2. **Service Mesh (e.g., Istio, Linkerd)**

   * Handles mTLS, retries, policies automatically.

3. **Token-based Authentication (JWT / OAuth2)**

   * Services exchange **JWT tokens** issued by an Identity Provider.
   * Example: Order Service calls Payment Service → attaches JWT in header → Payment validates token.

### Example Diagram:

```
Order Service -----> [mTLS + JWT] -----> Payment Service
         (Identity Provider issues tokens)
```

## 9. What is service discovery, and how is it typically implemented?

**Service Discovery** is the mechanism that allows microservices to **find and communicate** with each other without hardcoding network addresses.

### Why Needed?

* Services are often dynamic (scaled up/down, moved across nodes in Kubernetes).
* Hardcoding IPs/ports is not feasible.

### Types of Service Discovery

1. **Client-side Discovery**

   * Client queries the **service registry** (e.g., Eureka, Consul).
   * Client chooses an instance and makes the call.

2. **Server-side Discovery**

   * Client sends request to a **load balancer/gateway**.
   * The load balancer queries the registry and forwards request to available service.

### Example Diagram:

```
Client-Side Discovery:                  Server-Side Discovery:
Client --> Service Registry --> Service   Client --> API Gateway/Load Balancer --> Service Registry --> Service
```

**Typical Implementations:**

* Netflix **Eureka** (Java-based ecosystems).
* HashiCorp **Consul** (multi-platform).
* Kubernetes **DNS + Service objects** (built-in service discovery).


## Data Management

Excellent set of questions 🚀 — these are **core data management topics in microservices** that often come up in senior-level interviews.
I’ll break down each one with **answers, examples, and simple ASCII-style diagrams**.

---

## 10. How do microservices handle **database per service** vs **shared database** approach?

### **Database per Service** (recommended)

* Each microservice owns its own database.
* Promotes loose coupling & independent schema evolution.
* Avoids tight coupling between teams.
* Ensures bounded context (DDD).

**Drawback**: Data consistency is harder (no global ACID transactions).

```
[User Service] ----> UserDB
[Order Service] ---> OrderDB
[Product Service] -> ProductDB
```

### **Shared Database**

* Multiple microservices access the same database schema.
* Easier to enforce **ACID transactions** across services.
* But creates **tight coupling** — schema change impacts all services.

```
[User Service] -----\
[Order Service] -----> SharedDB
[Product Service] ---/
```

👉 **Best Practice**: Use **Database per Service** for autonomy. Use **shared database** only in legacy systems or transitional phases.

---

## 11. How do you implement **distributed transactions** in microservices (e.g., Saga pattern)?

Since each service has its own DB, a single ACID transaction across services is not possible.
Solution: **Saga Pattern** (sequence of local transactions + compensation).

### Example: E-Commerce Order

1. **Order Service** → create order (local DB).
2. **Payment Service** → deduct money.
3. **Inventory Service** → reduce stock.

If **Inventory fails** → trigger **compensating transaction** (refund payment, cancel order).

### Diagram:

```
Order Service ---> Payment Service ---> Inventory Service
   |                  |                     |
   v                  v                     v
 Create Order     Deduct Balance        Reduce Stock
   |                  |                     |
   |<----- Compensation if failure ----------|
```

👉 Saga can be implemented in:

* **Choreography** (event-driven, services listen to events).
* **Orchestration** (central Saga orchestrator coordinates flow).

---

## 12. What is the difference between **Event Sourcing** and **CQRS**, and when would you use them?

### **CQRS (Command Query Responsibility Segregation)**

* Separate **commands (write)** from **queries (read)**.
* Write model handles updates.
* Read model is optimized for queries (denormalized).

```
Client --> Command API --> Write DB
Client --> Query API   --> Read DB
```

**Use when**:

* High read/write imbalance.
* Need denormalized read models for performance.

---

### **Event Sourcing**

* Instead of storing current state, store **all events** that happened (append-only log).
* Current state is derived by replaying events.

```
Event Store: 
- OrderCreated
- PaymentProcessed
- StockReduced
(Current state = derived by replaying these events)
```

**Use when**:

* Need **audit/history tracking** (financial apps).
* Complex workflows where state can be rebuilt from events.

---

### Relationship:

* **Event Sourcing** and **CQRS** often work together.
* Events update the **write model**, while read models subscribe to events to keep queries fast.

---

## 13. How do you handle data consistency across multiple microservices?

In microservices, **strong consistency (ACID)** is hard. Instead, we aim for **eventual consistency** using patterns:

1. **Saga Pattern** – ensures eventual consistency via compensations.
2. **Event-Driven Architecture** – services publish events after state changes.

   * Example: Order placed → event → Inventory reduces stock → Payment processes.
3. **Idempotency** – retry-safe operations (e.g., “deduct payment” should not double-charge).
4. **Outbox Pattern** – ensures DB changes + event publishing are consistent.

   * Service writes to DB and “Outbox table” → background job publishes events from Outbox.
5. **Distributed Locks / Consensus** – rarely used (too slow), but sometimes needed (e.g., leader election).

### Example Diagram (Eventual Consistency):

```
Order Service ---> publishes "OrderPlaced" event ---> Payment Service
                   |
                   +---> Inventory Service
```

Each service updates **its own DB** based on the event. If a failure occurs, compensations or retries ensure eventual consistency.


 

## Reliability & Scalability

## 14) How do you ensure fault tolerance in microservices?

**Principles**

* **Design for failure**: assume any network call can fail.
* **Isolation**: one service’s failure shouldn’t cascade (bulkheads).
* **Graceful degradation**: provide fallbacks when dependencies fail.
* **Automated recovery**: health checks, restarts, autoscaling.

**Key Techniques**

* **Timeouts**: never wait forever on calls.
* **Retries with backoff + jitter** (only for safe operations).
* **Circuit breakers**: open after repeated failures.
* **Bulkheads**: separate thread pools/connection pools per dependency.
* **Idempotency**: safe to retry without side effects.
* **Caching/fallbacks**: serve stale or default data.
* **Dead-letter queues**: isolate poison messages.
* **Chaos testing**: proactively inject failures.

**Diagram (isolation + fallback)**

```
Client
  |
  v
[ API Gateway ]
  |
  v
[ Order Svc ] --(timeout/retry/cb)--> [ Payment Svc ]
      |                                   ^
      +-- fallback: queue charge ---------+
```

---

## 15) Can you explain the circuit breaker pattern?

A **circuit breaker** prevents constant calls to a failing dependency from wasting resources and causing cascading failures.

**States**

* **Closed**: calls flow normally; failures are counted.
* **Open**: too many failures → stop calls immediately (fast fail).
* **Half-Open**: after a cool-down, allow a small number of trial calls; success closes it, failure reopens it.

**When to use**

* Any remote call that might experience intermittent failures or slowdowns.

**Diagram**

```
Caller --> [ Circuit Breaker ] --> Dependency
             |     |     |
          Closed Open Half-Open
```

**Example (C# with Polly)**

```csharp
var breakerPolicy = Policy
  .Handle<HttpRequestException>()
  .OrResult<HttpResponseMessage>(r => (int)r.StatusCode >= 500)
  .CircuitBreakerAsync(
      exceptionsAllowedBeforeBreaking: 5,
      durationOfBreak: TimeSpan.FromSeconds(30));

var timeoutPolicy = Policy.TimeoutAsync<HttpResponseMessage>(2);

var policyWrap = Policy.WrapAsync(breakerPolicy, timeoutPolicy);

var response = await policyWrap.ExecuteAsync(() => httpClient.GetAsync(url));
```

---

## 16) How do you handle retries and idempotency in distributed systems?

**Retries**

* Use **exponential backoff + jitter** to avoid thundering herds.
* Retry only on **transient** failures (timeouts, 5xx), not on 4xx.
* Combine with **timeouts** and **circuit breakers**.

**Idempotency**

* The same request can be processed multiple times without changing the result beyond the first application.

**Techniques**

* **Idempotency keys**: client sends a unique key; server stores result keyed by it.
* **Detect duplicates**: check key or message ID before applying side effects.
* **At-least-once consumers**: make handlers idempotent (e.g., upsert vs insert).
* **Outbox + dedupe**: publish events from an outbox table and track processed IDs.

**Example (HTTP idempotency in C#)**

```csharp
// Header: Idempotency-Key: 8f0c-...-a1
// Pseudocode
if (store.TryGet(key, out var cachedResult))
    return cachedResult;

var result = ProcessCharge(request);     // side effect (e.g., payment)
store.Save(key, result);                 // persist outcome
return result;
```

**Retry/backoff diagram**

```
T0: attempt 1 (fail)
T1: wait 200ms + jitter -> attempt 2 (fail)
T2: wait 400ms + jitter -> attempt 3 (success)
```

---

## 17) What strategies can be used for scaling microservices independently?

* **Stateless services**: keep state in external stores (DB, cache) so instances can scale horizontally.
* **Autoscaling**: CPU/RAM/queue length or custom SLO-based metrics.
* **Partitioning/sharding**: split load by tenant, region, shard key.
* **Read replicas / CQRS**: scale reads separately from writes.
* **Specialized infrastructure**: pick data stores fit to the service (e.g., time-series DB for metrics svc).
* **Async offloading**: move heavy tasks to background workers.
* **Cache**: edge/CDN, API Gateway cache, per-service cache.

**Diagram (independent scale)**

```
            +--------------+
Client ---> | API Gateway  |
            +--------------+
                |      |
         +------+      +------+
         v                    v
   [ Order Svc x10 ]    [ Payment Svc x3 ]
```

---

## 18) How do you design for high availability in microservices?

**Availability Building Blocks**

* **Redundancy**: multiple instances per service.
* **Multi-AZ/zone deployment**: spread instances across zones.
* **Stateless + health checks**: replace unhealthy pods quickly.
* **Load balancing**: distribute traffic; remove failing nodes.
* **Graceful degradation**: optional features can fail without blocking core paths.
* **Data HA**: replicated databases, quorum, backups, PITR.
* **Message durability**: replicated brokers (e.g., Kafka with replication factor).
* **Blue/green or canary deploys**: reduce downtime and blast radius.
* **SLOs/SLAs + Error Budgets**: guide release velocity.

**HA Request Path**

```
Client
  |
  v
[ Global LB ]
  |
  +--> Region A (AZ-1, AZ-2)
  |      |
  |   [ Service A x3 ] --(to)--> [ DB-A (primary) ] <--> [ DB-B (replica) ]
  |
  +--> Region B (AZ-1, AZ-2)
         |
      [ Service A x3 ]
```

**Kubernetes example (readiness/liveness)**

* **Readiness probe**: receive traffic only when ready.
* **Liveness probe**: restart when unhealthy.
* **PodDisruptionBudget**: keep minimum replicas during maintenance.
 
---

## Observability & Monitoring

19. How do you implement logging in microservices?
20. What is **distributed tracing** and why is it important?
21. What are key metrics you would monitor for microservices?
22. Which tools do you use for monitoring and observability (e.g., Prometheus, Grafana, ELK, Jaeger, Azure App Insights)?

---

## Security

23. How do you handle authentication and authorization in microservices?
24. What is the role of OAuth2 / OpenID Connect in microservices security?
25. How do you secure communication between microservices?

---

## Deployment & CI/CD

26. How do you containerize microservices using Docker?
27. What role does Kubernetes (K8s) play in managing microservices?
28. How do you handle service versioning and backward compatibility?
29. What deployment strategies are commonly used (Blue-Green, Canary, Rolling)?

---

## Advanced & Real-World

30. How do you deal with **service orchestration vs choreography**?
31. What is the difference between **orchestration tools** (like Kubernetes) and **workflow orchestration** (like Netflix Conductor, Temporal)?
32. How do you migrate a monolithic application into microservices step by step?
33. Can you explain the **strangler fig pattern**?
34. How do you test microservices (unit, contract, integration, end-to-end)?
35. How do you ensure API backward compatibility during microservice updates?

