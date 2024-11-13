# Product Requirements Document (PRD)

## Project: TikTok Carousel Post Generator App
**Version:** 1.0  
**Date:** [Insert Date]

## 1. Introduction

### 1.1 Overview
The TikTok Carousel Post Generator App is a web application built using Next.js that automates the creation of TikTok carousel posts. The app selects images from a folder, generates educational text using GPT-4o-mini, overlays the text onto the images, and exports the slides into a structured folder. Users can adjust or re-prompt the AI to regenerate specific slides through a simple front-end interface.

### 1.2 Purpose
The purpose of this app is to streamline the creation of engaging TikTok carousel posts that teach business opportunities in e-commerce and dropshipping. By automating the process, we aim to attract an audience interested in starting or improving their dropshipping stores.

### 1.3 Goals
- Automate the generation of TikTok carousel posts.
- Use AI to generate clear and easy-to-understand educational content.
- Provide a user-friendly interface for customization.
- Encourage audience engagement with effective call-to-action slides.

## 2. Features

### 2.1 Automatic Image Selection
- The app will automatically select 5-7 images from a predefined folder.

### 2.2 AI-Generated Text
- Integrate GPT-4o-mini to generate text for each slide based on the number of slides (excluding the CTA slide).
- Set instructions for the AI to produce clear and concise educational content.

### 2.3 Text Overlay on Images
- Overlay the generated text onto the center of each image.
- Use Comic Sans font, white color text with a black border for readability.

### 2.4 Export Slides
- Export all slides, including the CTA slide, into a /slides folder.
- Save them in a subfolder named with the creation date.

### 2.5 Customizable CTA Slide
- Allow users to provide a link to the CTA slide.
- Instructions on how to upload and link the CTA slide.

### 2.6 Front-End Interface
- Input area to adjust or re-prompt the AI for regenerating slides.
- Option to select specific slides to regenerate.
- Real-time preview of slides after regeneration.

## 3. User Stories

- As a user, I want the app to automatically generate TikTok carousel posts so that I can save time on content creation.
- As a user, I want to adjust or re-prompt the AI to regenerate slides so that the content meets my expectations.
- As a user, I want to select specific slides to regenerate so that I can fine-tune individual slides without affecting the entire carousel.
- As a user, I want to provide a link to my custom CTA slide so that it aligns with my branding and call-to-action.

## 4. Functional Requirements

### 4.1 Image Selection
- FR1: The app shall select 5-7 images randomly or sequentially from a specified folder.

### 4.2 Text Generation
- FR2: The app shall use GPT-4o-mini to generate text for each slide based on predefined templates and instructions.
- FR3: The AI shall recognize the total number of slides and generate text accordingly (e.g., if there are 8 slides, generate text for slides 1-7).

### 4.3 Text Overlay
- FR4: The app shall overlay the generated text onto the center of each image.
- FR5: The text shall be in Comic Sans font, white color, with a black border.

### 4.4 Export Functionality
- FR6: The app shall export all slides into a /slides directory.
- FR7: Slides shall be saved in a subfolder named with the date of creation (e.g., /slides/2023-10-05/).

### 4.5 CTA Slide Integration
- FR8: The app shall allow users to provide a link to their custom CTA slide.
- FR9: The CTA slide shall always be the last slide in the carousel.

### 4.6 Front-End Interface
- FR10: The app shall provide an input area for users to adjust or re-prompt the AI.
- FR11: Users shall be able to select specific slides to regenerate.
- FR12: The app shall display a real-time preview of the slides after regeneration.

## 5. Non-Functional Requirements

### 5.1 Performance
- NFR1: The app shall generate and render slides within 10 seconds.

### 5.2 Usability
- NFR2: The interface shall be intuitive and user-friendly.

### 5.3 Scalability
- NFR3: The app shall handle multiple users concurrently without performance degradation.

### 5.4 Security
- NFR4: The app shall securely handle user inputs and data.

## 6. Technical Requirements

### 6.1 Technology Stack
- Front-End: Next.js, React
- Back-End: Node.js
- AI Integration: GPT-4o-mini API
- Image Processing: Canvas API or Sharp library
- Styling: CSS Modules or Styled Components

### 6.2 Dependencies
- next
- react
- node-fetch (for API calls)
- canvas or sharp (for image manipulation)
- dotenv (for environment variables)

### 6.3 APIs
- GPT-4o-mini API: For text generation.

## 7. UI/UX Design

### 7.1 Interface Layout
- Header: App logo and title.
- Main Section:
  - Input area for AI prompts.
  - Dropdown or checkbox to select slides to regenerate.
  - Button to generate or regenerate slides.
- Preview Section:
  - Thumbnails of each slide.
  - Option to click and view a larger preview.

### 7.2 User Interaction Flow
1. User accesses the app and sees the default input prompt.
2. User can adjust the prompt or select specific slides to regenerate.
3. User clicks on "Generate Slides."
4. The app displays a loading indicator during processing.
5. Generated slides are displayed in the preview section.
6. User can download the slides from the /slides folder.

## 8. Implementation Steps

### 8.1 Setup Next.js App
1. Initialize a new Next.js project.
2. Configure necessary scripts in package.json.

### 8.2 Integrate GPT-4o-mini
1. Sign up and obtain API access to GPT-4o-mini.
2. Create a service module to handle API calls to GPT-4o-mini.
3. Define a function `generateSlideText(totalSlides)` that sends a prompt to the AI and receives the text output.
   
   Prompt Template:
   ```
   Generate educational text for a TikTok carousel post about dropshipping. There are {totalSlides} slides excluding the CTA slide. Each slide should have concise and engaging text. Examples:
   1. How to start dropshipping in 24hrs
   2. Create a store using AI in < 2 mins (details on slide 8)
   ...
   Provide the text for each slide in a numbered list.
   ```
4. Ensure the AI understands the formatting requirements.

### 8.3 Implement Image Selection
1. Create a folder /public/images and add subfolders or images.
2. Write a function `selectImages(numImages)` to select 5-7 images from the folder.
   - Use fs module to read the directory contents.
   - Randomly or sequentially select images.

### 8.4 Develop Text Overlay Functionality
1. Use the Canvas API or Sharp library for image manipulation.
2. Write a function `overlayTextOnImage(imagePath, text, outputPath)` that:
   - Loads the image.
   - Calculates the center position.
   - Adds text with Comic Sans font, white color, and black border.
   - Saves the new image to the specified output path.

### 8.5 Build Front-End Interface
1. Create components for:
   - Input area for AI prompt adjustments.
   - Slide selection (e.g., checkboxes for each slide).
   - Generate button.
   - Slide previews.
2. Manage state using React hooks for user inputs and generated data.
3. Handle form submissions and trigger backend API routes.

### 8.6 Implement Re-Generation of Slides
1. When the user selects specific slides to regenerate, capture the slide numbers.
2. Update the AI prompt to focus on those slides.
   
   Example Prompt:
   ```
   Regenerate text for slides 3 and 5 of a TikTok carousel post about dropshipping. The other slides are unchanged. Provide the text for each slide in a numbered list.
   ```
3. After receiving new text, overlay it onto the existing images or regenerate those slides entirely.

### 8.7 Export Functionality
1. After generating the slides, save them into /public/slides/{YYYY-MM-DD}/.
2. Ensure the directory is created if it doesn't exist using fs.mkdir.
3. Provide a download link or button for users to access the folder.

### 8.8 CTA Slide Integration
1. Allow users to upload their custom CTA slide via the front-end interface.
   - Use an `<input type="file">` element.
2. Save the CTA slide in the same slides folder.
3. Ensure the CTA slide is always the last slide when exporting.

### 8.9 Testing
1. Write unit tests for each function (image selection, text generation, text overlay).
2. Perform integration testing to ensure all components work together.
3. Test the front-end interface for usability and bugs.

## 9. Additional Details

### 9.1 Providing a Link to the CTA Slide
- Users can upload their CTA slide through the front-end interface.
- Alternatively, users can provide a URL link to an image hosted online.
- Instructions:
  - If uploading: Use the upload button to select your CTA image.
  - If linking: Paste the URL of your CTA image in the provided input field.
- The app will fetch and include the CTA slide as the last slide in the carousel.

### 9.2 Folder Structure for Slides
- All generated slides are saved in /public/slides/.
- Each session creates a new subfolder named with the date and time (e.g., /public/slides/2023-10-05_14-30-00/).
- This ensures that slides from different sessions do not overwrite each other.

## 10. Timeline and Milestones

- Week 1: Project Setup and Basic Functionality
  - Set up Next.js project.
  - Implement image selection and display.
- Week 2: AI Integration and Text Overlay
  - Integrate GPT-4o-mini.
  - Develop text overlay functionality.
- Week 3: Front-End Interface Development
  - Build input areas and slide previews.
  - Implement slide regeneration features.
- Week 4: Export and CTA Slide Features
  - Implement export functionality.
  - Add CTA slide integration.
- Week 5: Testing and Bug Fixes
  - Conduct thorough testing.
  - Fix identified bugs.
- Week 6: Deployment and Documentation
  - Prepare for deployment.
  - Write user documentation.

## 11. Appendix

### 11.1 Sample AI Prompts

Initial Prompt:
```
Generate educational text for a TikTok carousel post about starting a dropshipping business. There are 8 slides in total, with the last slide being a call-to-action. Provide text for slides 1-7 that is clear and easy to understand.
```

Regeneration Prompt:
```
Regenerate the text for slide 3 to focus on finding winning products in real-time. Keep the tone engaging and informative.
```

### 11.2 Font and Styling Details
- Font: Comic Sans MS
- Text Color: White (#FFFFFF)
- Text Border: Black (#000000)
- Text Alignment: Centered both horizontally and vertically.

## 12. Conclusion

This PRD outlines the requirements and steps to build the TikTok Carousel Post Generator App using Next.js. By following this document, developers can create an app that automates the creation of engaging TikTok carousel posts, helping users attract an audience interested in dropshipping. The app combines AI-generated content with user-friendly customization options, providing a valuable tool for content creators.