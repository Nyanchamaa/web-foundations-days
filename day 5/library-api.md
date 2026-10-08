# Library Books API

## Overview

The Library Books API is a REST API for managing books in a library system.

The API allows users to list books, retrieve individual books, create books,
update books, delete books, and search for books by author.

## Endpoints

### 1. List all books

**Method:** GET

**Path:** `/api/books`

**Description:** Returns a list of all books.

**Example request:**

```http
GET /api/books