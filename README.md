# Node.js API with SOLID principles

API for a gym chek-in app.

## Functional Requirements

- [x] Should be able to sign up;
- [x] Should be able to sign in;
- [x] Should be able to fetch the profile of a authenticated user;
- [ ] Should be able to fetch the number of check-ins of a user;
- [ ] Should be able to obtain the check-in history of the user;
- [ ] Should be possible to search gyms nearby;
- [ ] Should be possible to search gyms by name;
- [x] Should be possible to check-in in a gym;
- [ ] Should be possible to validate a user's check-in;
- [ ] Should be possible to add a gym;

## Business rules

- [x] The user shouldn't be able to sign up with a duplicated e-mail;
- [x] The user cannot check-in twice in the same day;
- [ ] The user cannot check-in if they aren't near (100m) a gym;
- [ ] Check-in can be validated up to 20 minutes after being created;
- [ ] Check-in can only be validated by admins;
- [ ] Gyms can only be added by admins;

## Non-functional requirements

- [x] User password must be encrypted;
- [x] All the data must be persisted in a PostgresSQL database;
- [ ] All data lists must be paginated with 20 items per page;
- [ ] User mus be identified by a JWT.
