# Patlytics_Web

Patlytics_Web is a web application for patent infringement analysis. Users can input a patent ID and company name to check for potential infringements, receiving details on the top two infringing products and relevant claims. Please note that this is only the front-end of the application. To have a complete setup, you will also need to run the back-end service from the [Patlytics_API](https://github.com/hsps955201/Patlytics_API) project.

## Project Structure

- **`/public`**: Contains static assets like images and icons.
  
- **`/src`**: Holds the source code, including components, pages, styles, and utilities.

- **`package.json`**: Manages dependencies and scripts.

- **`README.md`**: Documentation for the project.

## Installation and Usage

To install and use the project:

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/patlytics_web.git
   ```

2. Navigate to the project directory:
   ```
   cd patlytics_web
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

### Running with Docker

You can also run the application using Docker. To do this, ensure you have Docker installed, then follow these steps:

1. Build the Docker image:
   ```
   docker build -t patlytics_web .
   ```

2. Run the Docker container:
   ```
   docker run -p 3001:3001 patlytics_web
   ```

3. Access the application in your web browser at `http://localhost:3001`.
