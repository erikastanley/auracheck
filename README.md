# AuraCheck - Color Contrast Accessibility Checker

A designer-forward web tool for testing color palette accessibility. Upload your color palettes, extract colors directly from images, and instantly check WCAG contrast standards.

## 🎨 Features

- **Screenshot Upload**: Upload PNG and JPG files of your color palettes
- - **Color Picker Tool**: Click anywhere on the uploaded image to extract colors
  - - **WCAG Compliance Testing**: Automatically test all color combinations against WCAG AA and AAA standards
    - - **Visual Results Matrix**: See pass/fail results in an easy-to-understand grid layout
      - - **Smart Feedback**: Get clear explanations for failures and actionable fix suggestions
        - - **Export Options**: Share results as images, PDFs, or shareable links
          - - **Admin Dashboard**: Manage app settings and view usage analytics
           
            - ## 🚀 Tech Stack
           
            - - **Frontend**: React 18 + TypeScript
              - - **Build Tool**: Vite
                - - **Styling**: Tailwind CSS
                  - - **UI Components**: Radix UI
                    - - **State Management**: Zustand
                      - - **Backend/Worker**: Cloudflare Workers
                       
                        - ## 📋 Project Structure
                       
                        - ```
                          auracheck/
                          ├── src/
                          │   ├── pages/              # Page components
                          │   ├── components/         # Reusable React components
                          │   ├── lib/               # Utility functions and constants
                          │   ├── hooks/             # Custom React hooks
                          │   ├── stores/            # State management (Zustand)
                          │   ├── App.tsx            # Main app component
                          │   ├── main.tsx           # App entry point
                          │   └── index.css          # Global styles
                          ├── worker/                # Cloudflare Worker code
                          ├── package.json           # Project dependencies
                          ├── tailwind.config.js     # Tailwind CSS config
                          ├── tsconfig.json          # TypeScript config
                          └── README.md              # This file
                          ```

                          ## 🛠️ Installation & Setup

                          ```bash
                          # Install dependencies
                          npm install

                          # Development server (Vite)
                          npm run dev

                          # Build for production
                          npm run build

                          # Preview production build
                          npm run preview

                          # Deploy to Cloudflare
                          npm run deploy
                          ```

                          ## 🎯 How to Use

                          1. Visit the app (no login required for basic features)
                          2. 2. Upload a screenshot of your color palette (PNG or JPG)
                             3. 3. Click on colors in the image to select them
                                4. 4. View instant WCAG contrast test results
                                   5. 5. Read detailed explanations and fix suggestions
                                      6. 6. Export and share your accessibility report
                                        
                                         7. ## 🌐 WCAG Standards Explained
                                        
                                         8. - **WCAG AA (Baseline)**: Standard accessibility requirement - 4.5:1 contrast for normal text
                                            - - **WCAG AAA (Enhanced)**: Higher accessibility requirement - 7:1 contrast for normal text
                                              - - Both standards consider text size (normal vs. large text have different requirements)
                                               
                                                - ## 👥 User Types
                                               
                                                - ### Public Users
                                                - - Full feature access (no login required)
                                                  - - Upload, analyze, and export color palettes
                                                    - - No saved history after session ends
                                                     
                                                      - ### Admin
                                                      - - Protected dashboard access
                                                        - - Manage default settings and copy
                                                          - - View basic usage analytics
                                                           
                                                            - ## 📝 Development Notes
                                                           
                                                            - ### Key Components
                                                            - - **HomePage.tsx**: Main user interface
                                                              - - **ContrastResultsMatrix.tsx**: Grid display of contrast test results
                                                                - - **ImageUploader.tsx**: File upload and image handling
                                                                  - - **CanvasColorPicker.tsx**: Color extraction from images
                                                                    - - **ExportOptions.tsx**: Export functionality (image, PDF, link)
                                                                     
                                                                      - ### Utilities
                                                                      - - **colorUtils.ts**: Color conversion and contrast calculation
                                                                        - - **constants.ts**: WCAG standards and color mappings
                                                                          - - **auraCheckStore.ts**: Global state management
                                                                           
                                                                            - ## 📦 Dependencies
                                                                           
                                                                            - ### Main Dependencies
                                                                            - - react, react-dom
                                                                              - - @radix-ui/* (UI components)
                                                                                - - tailwindcss
                                                                                  - - zustand (state management)
                                                                                    - - Various TypeScript and build tools
                                                                                     
                                                                                      - See `package.json` for complete dependency list.
                                                                                     
                                                                                      - ## 🎨 Design Philosophy
                                                                                     
                                                                                      - - **Designer-Forward**: Bold, modern, Figma-adjacent design
                                                                                        - - **No Friction**: Simple, intuitive interface with minimal cognitive load
                                                                                          - - **High Contrast**: Neutral backgrounds, colorful accents, never competes with user palettes
                                                                                            - - **Confident Tone**: Clear, slightly sassy, never condescending
                                                                                             
                                                                                              - ## 🚢 Deployment
                                                                                             
                                                                                              - The project is configured to deploy to Cloudflare:
                                                                                             
                                                                                              - ```bash
                                                                                                npm run deploy
                                                                                                ```

                                                                                                This uses Wrangler to deploy both the frontend (Vite build) and backend (Cloudflare Workers).

                                                                                                ## 📄 License

                                                                                                This project is open source and available under the MIT License.

                                                                                                ## 🤝 Contributing

                                                                                                Contributions are welcome! Please feel free to submit a Pull Request.

                                                                                                ## 📧 Contact

                                                                                                For questions or feedback about AuraCheck, please open an issue on this repository.

                                                                                                ---

                                                                                                **Made with ❤️ for better web accessibility**
