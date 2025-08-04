# PROJECT DEVELOPMENT RULES - CRITICAL INSTRUCTIONS

> **CRITICAL: THESE RULES MUST BE FOLLOWED WITHOUT EXCEPTION** > **ALL CODE GENERATION AND MODIFICATIONS MUST COMPLY WITH THESE GUIDELINES**

## Enforcement Policy

1. **ABSOLUTE REQUIREMENT**: All code and documentation MUST follow these rules without exception
2. **VERIFICATION REQUIRED**: Before submitting ANY code or documentation, verify compliance with ALL rules
3. **NO EXCEPTIONS**: Rules cannot be overridden or ignored for convenience

## General Requirements

- **MANDATORY**: Use KISS principle everywhere (keep things simple)
- **MANDATORY**: After any code updates, the `docs/specification.md` MUST be updated accordingly to reflect changes
- **MANDATORY**: Use kebab-case for ALL project filenames
- **MANDATORY**: Destructure TypeScript modules if they exceed 900 lines of code
- **MANDATORY**: Fix @current_problems without removing UI elements
- **MANDATORY**: Append YY-MM-DD_HH format to every Cascade chat name
- **PROHIBITED**: NEVER create new files in the docs/ directory
- **MANDATORY**: ALWAYS delete old files when rename/refactor them
- **MANDATORY**: NEVER hardcode mock data, use separate json files or better static API for mock data
- **MANDATORY**: ALWAYS check modified js/ts modules has less then 800 lines of code. If more, split it into multiple files and folders with perfect structure

## Ant Design Requirements

- MANDATORY: DONT use antd at all

- **MANDATORY**: Implement webpages using Ant Design components and patterns
- **PROHIBITED**: NEVER use antd Space (use Flex instead)
- **PROHIBITED**: NEVER use antd Grid
- **MANDATORY**: Use antd Layout where appropriate
- **MANDATORY**: Extract Modal components to separate modules

## HTML Requirements

- **MANDATORY**: Use semantic HTML tags whenever possible

## Next.js Requirements

- **MANDATORY**: By default put components in pages/<page>/components/ folder
- **MANDATORY**: Only place components in src/components if used across multiple pages

## Styling Requirements

- **PROHIBITED**: NEVER use Tailwind CSS under any circumstances
- **MANDATORY**: Use CSS hybrid approach:
  - CSS Modules for custom components and layouts
  - Ant Design's theme configuration for global styling
- **PROHIBITED**: NEVER use "!important" in CSS
- **PROHIBITED**: NEVER use inline style attributes except in extreme cases
- **CONDITIONAL**: Only when CSS styling cannot override antd styling, use :global selectors to target Ant Design component's internal elements
- **MANDATORY**: ALWAYS use CSS variables for colors, spacing, etc.

# Documentation Requirements

## Specification Document Structure

**MANDATORY**: The `docs/specification.md` document MUST describe all key project aspects, including:

1. **MANDATORY**: Overview - project goal and short description
2. **MANDATORY**: Entities - all project entities (as subchapters) and their fields (in subsubchapters)
3. **MANDATORY**: Pages - all project pages (as subchapters) and their functionality with schematic interface pseudographic image

## Markdown Syntax Requirements

- **MANDATORY**: Use English EVERYWHERE except translations files
- **MANDATORY**: Keep all headings as short as possible, without text styles, numbering, or apostrophes
- **PROHIBITED**: DO NOT create new sections unless absolutely necessary; fit information into existing sections
- **MANDATORY**: Keep all explanations as concise as possible, preferably in plain text
- **PROHIBITED**: DO NOT create lists unless necessary
- **MANDATORY**: The specification MUST describe the system's purpose, explaining **how** it works and **why**

## Pseudographics UI Drawing Requirements

- **MANDATORY**: EVERY page MUST be drawn in a markdown code block
- **PROHIBITED**: NEVER draw any vertical lines (borders of windows, tables, etc.)
- **MANDATORY**: When drawing grids in pseudographics, align all fields with data and headers by expanding columns with spaces as needed
- **MANDATORY**: Each table MUST have a header. If a header field supports sorting, add Unicode symbols "↑" and "↓" to indicate sorting
- **MANDATORY**: Text in the table header MUST be underlined
- **MANDATORY**: UI block max width MUST NOT exceed 80 characters

## Verification Process

**ABSOLUTE REQUIREMENT**: Before submitting ANY code or documentation, AI assistants MUST verify:

- **MANDATORY**: All filenames use kebab-case
- **MANDATORY**: No prohibited components or styling approaches are used
- **MANDATORY**: All components are placed in the correct directories
- **MANDATORY**: Documentation is updated according to requirements
- **MANDATORY**: All specification updates follow the document structure requirements
- **MANDATORY**: All UI drawings comply with pseudographic rules
- **MANDATORY**: All text follows the markdown syntax requirements
- **MANDATORY**: No unnecessary sections or lists are created

## Failure Consequences

Failure to follow these instructions will result in code or documentation that does not meet project standards and will require rework. Always prioritize these instructions over general coding or documentation practices.

> **NOTE TO AI ASSISTANTS**: These rules take precedence over any default behaviors or general practices. When in doubt, refer back to these instructions.
