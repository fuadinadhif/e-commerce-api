# Commonly Used e-Commerce REST API

Full API documentation hosted on https://e-commerce-api-docs.herokuapp.com/

This is an experimental API design of commonly used REST API for an e-Commerce.
Feel free to use it for your own project but own your risk as this project still on experimental stage.
Hoping this could be used similar to [REQRES API](https://reqres.in/) someday.

## Usage

This project served on MongoDB Atlas (free tier ofcourse :slightly_smiling_face:) so you can used directly after installed the dependecies and set up the environment variables. Or you can clone this repo and set up your own server.

**Note**: Because of the limitation of free tier on MongoDB Atlas. The database will be clean up periodically.

## Installation

```bash
  npm install my-project
  cd my-project
```

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

`MONGO_URI`
`JWT_SECRET`
`JWT_LIFETIME`

## Stack

- Node.js/Express
- MongoDB/Mongoose
- Documentation: [Docgen](https://github.com/thedevsaddam/docgen) (Easier setup compared too [Swagger](https://swagger.io/) but way less features)

## License

Licensed under the [MIT License](LICENSE.md).
