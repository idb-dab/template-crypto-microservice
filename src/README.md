# MongoDB Relationship Examples for Entity Design in Microservices

This repository contains examples of differenty types of relationships between entities using NestJS and Mongoose. The examples make use of CRUD template (generics) to provide reusable CRUD operations for managing the entities involved.

## Examples

### 1. One-to-One Relationship

In an one-to-one relationship, each document in one collection corresponds to only one document in another collection.

* Entities: Customer, Account
* Description: Shows an one-to-one relationship between a customer and their account. Each customer can have only one account.

### 2. One-to-Many Relationship

In an one-to-many relationship, each document in one collection can correspond to multiple documents in another collection.

* Entities: Account, Transaction
* Description: Shows an one-to-many relationship between an account and its transactions. An account can have multiple transactions.

### 3. Many-to-One Relationship

In a many-to-one relationship, multiple documents from one collection can correspond to a single document in another collection.

* Entities: Account, Bank
* Description: Shows a many-to-one relationship between multiple accounts and its corresponding bank. Multiple accounts can belong to a specific bank.

### 4. Many-to-Many Relationship

In a many-to-many relationship, multiple documents from one collection can correspond to multiple documents in another collection.

* Entities: Bank, City
* Description: Shows a many-to-many relationship between multiple banks and cities. A bank can be located in multiple cities, and a city can have multiple banks.

### 5. Self-referencing Relationship

In a self-referencing relationship, documents within the same collection can be related to each other. 

* Entity: Transaction
* Description: Shows a self-referencing relationship where a transaction can have a parent transaction.