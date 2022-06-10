# Commonly Used e-Commerce REST API

Full API documentation hosted on https://e-commerce-api-docs.herokuapp.com/

This is an experimental API design of commonly used REST API for an e-Commerce.
Feel free to use it for your own project but own your risk as this project still on experimental stage.
Hoping this could be used similar to [REQRES API](https://reqres.in/) someday.

## Usage

This project served on MongoDB Atlas and assets on Cloudinary (both free tier of course :slightly_smiling_face:) so you can used it directly using the [documentation](https://e-commerce-api-docs.herokuapp.com/) as a guide. Or you can clone this repo and set up your own server.

**Note**: Because of the limitation of free tier on MongoDB Atlas and Cloudinary. The database will be clean up periodically.

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
`CLOUD_NAME`
`CLOUD_API_KEY`
`CLOUD_API_SECRET`

## Stack

- Node.js/Express
- MongoDB/Mongoose
- Cloudinary
- Documentation: [Docgen](https://github.com/thedevsaddam/docgen) (Easier setup compared too [Swagger](https://swagger.io/) but way less features)

## License

Licensed under the [MIT License](LICENSE.md).
