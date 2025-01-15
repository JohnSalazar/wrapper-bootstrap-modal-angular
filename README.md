
# Wrapper Bootstrap Modal Angular

This project is a wrapper for Bootstrap modals in Angular, enabling centralized management of modals through a service. It allows efficient creation and destruction of modals from any part of the project.

## Features

- **Centralized Modals**: Modals are managed through a central service, simplifying their creation and destruction.
- **Component Registration**: Simply create the modal component and register it with the wrapper service.
- **Simplified Access**: To open a modal from anywhere in the project, instantiate the modal service and create a `modalData` variable specifying the modal name.
- **Data Passing**: You can pass data to the modal via `modalData.data`.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/JohnSalazar/wrapper-bootstrap-modal-angular.git
   ```

2. Navigate to the project directory:

   ```bash
   cd wrapper-bootstrap-modal-angular
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

## Usage

1. Start the development server:

   ```bash
   ng serve
   ```

2. Open your browser and access `http://localhost:4200/`.

3. To create a new modal:
   - Create the modal component.
   - Register the component with the wrapper service.

4. To call a modal from anywhere in the project:
   - Instantiate the modal service.
   - Create a `modalData` variable specifying the modal name.
   - Optionally, pass data to the modal using `modalData.data`.

## License

This project is licensed under the MIT License.

For more details, refer to the [LICENSE](https://github.com/JohnSalazar/wrapper-bootstrap-modal-angular/blob/main/LICENSE) file.

This project was developed by [JohnSalazar](https://github.com/JohnSalazar) <img alt="Brazil" src="https://github.com/user-attachments/assets/6340ab49-4afe-43cb-acce-53ab1e2f64c2" width="20" height="14"/> under the [MIT license](LICENSE.txt).
