# project-buddy-frontend
## Team: The Singleton

Project Buddy Dashboard 📊🤝💰
Supercharge your team's performance, retrospectives, and morale with a unified view of key project metrics and peer recognition.

(As of: April 2025)

Retro Buddy Dashboard is a web application designed to provide project teams with a centralized, insightful overview of their sprint performance, work distribution, meeting costs, and team appreciation. It replaces scattered data points and manual tracking with automated visualizations and integrated tools, fostering data-driven decisions, transparency, and a positive team culture.

(Suggestion: Replace the line above with an actual screenshot link once deployed or available)

The Problem It Solves 🤔
Modern project teams often struggle with:

Scattered Information: Sprint data, meeting schedules, costs, and team recognition live in different places (Jira, Calendar, Slack, etc.).
Lack of Visibility: Difficulty getting a quick, clear picture of sprint health, work types, individual contributions, or meeting overhead.
Ineffective Retrospectives: Discussions often rely on memory or subjective feelings rather than objective data.
Under-recognized Contributions: Peer-to-peer appreciation often gets lost in busy channels or isn't tracked effectively.
Manual Reporting Overhead: Time spent manually compiling data for reports and insights.
Retro Buddy Dashboard aims to solve these problems by providing a single, intuitive interface.

Key Features ✨
📊 Velocity Tracking:
Visualize committed vs. completed story points across sprints.
Filter velocity trends by individual team members or view the entire team.
🍰 Sprint Work Breakdown:
Pie chart showing the distribution of work (Bugs, Features, Chores) for any selected sprint.
Includes a dropdown to easily switch between sprints.
💡 Sprint Insights:
Automated textual insights based on the latest sprint's performance (e.g., warnings for low completion rates, high bug counts).
Provides AI-driven suggestions for potential focus areas.
👥 Team Member Comparison:
Compare the completed points trend for any two team members (or the entire team) across selected sprints.
💰 Meeting Cost Awareness:
Calculator: Estimate the cost of a single meeting based on participant rate and duration.
Aggregated View: Analyze historical meeting costs over time (Day, Month, Year).
Filter aggregated costs by Sprint or Milestone (based on calendar event data).
📅 Meeting Calendar:
Integrated calendar view displaying scheduled team meetings.
Tooltips show event details and associated costs (if available).
🎉 Kudos Recognition Feed: (Currently Frontend Mock with State)
Dedicated space for peer-to-peer appreciation.
Post kudos with recipient(s), message, tags (Helpfulness, Pairing, Innovation, etc.), and optional anonymity.
Filterable feed by recipient or tag.
Visually engaging card-based display.
How It Impacts Daily Activities 🚀
Integrating Retro Buddy into a team's workflow provides tangible benefits:

Data-Driven Stand-ups & Planning: Quickly reference velocity and work breakdown trends to inform daily progress and future sprint planning.
More Effective Retrospectives: Use objective data (velocity, completion rates, bug counts, feature output) as talking points, leading to more focused and actionable discussions.
Increased Transparency & Accountability: Everyone can see commitments, progress, and work distribution, fostering a shared understanding and accountability.
Boosted Team Morale: The dedicated Kudos section makes appreciation visible and encourages positive reinforcement, strengthening team bonds.
Improved Cost Consciousness: Visualizing meeting costs prompts discussions about meeting efficiency and necessity.
Reduced Context Switching: Access key project information and team recognition in one place, saving time hunting through different tools.
Enhanced Visibility for Leads/Managers: Provides a quick snapshot of team health, performance trends, and potential bottlenecks.
Why Retro Buddy? The Must-Have Advantages ✅
All-in-One View: Single pane of glass for critical team information. Stop juggling tools!
Actionable Insights: Go beyond raw data with automated observations and suggestions. Make informed decisions.
Fosters Positive Culture: The integrated Kudos system actively builds morale and recognition. Appreciate your team!
Highly Visual & Interactive: Clear charts and filters make data exploration easy and intuitive.
Reduces Manual Effort: Automate the visualization of common metrics. Save valuable time.
Promotes Transparency: Make key performance and cost indicators accessible and understandable.
Customizable Views: Filters allow teams and individuals to focus on what matters most to them.
Scalability & Org-Wide Implementation Feasibility 🌐
Retro Buddy Dashboard is designed with scalability in mind, but implementing it across an organization requires addressing these points:

Data Source Integration (Crucial): The current implementation uses a dummy Node.js API. For real-world use, this backend must be enhanced to connect to actual data sources:
Sprint Data: Integrate with Jira, Azure DevOps, or other project management tool APIs.
Calendar Events: Integrate with Google Calendar, Outlook Calendar APIs.
Kudos Users: Potentially integrate with HR systems or internal directories for accurate recipient lists.
Robust Backend: The dummy API needs to be replaced with a production-grade backend capable of handling concurrent users, managing API integrations securely, and potentially persisting Kudos data.
Authentication & Authorization: Implementing user login (e.g., SSO) and role-based access control is essential to ensure data privacy and appropriate visibility across different teams/roles.
Configuration: Mechanisms will be needed for teams to configure their specific settings (member lists, project keys/IDs, meeting cost rates, calendar sources).
Deployment: Standard web application deployment practices (Docker, Cloud Platforms like AWS/Azure/GCP, CI/CD pipelines) are applicable.
Conclusion: While the frontend provides a strong foundation, realizing org-wide potential requires significant backend development and integration work. However, the modular frontend design makes this feasible.

Tech Stack 🛠️
Frontend:
React (v18+)
TypeScript
Tailwind CSS (for styling)
Recharts (for charts)
React Select (for dropdowns)
React Big Calendar & Moment.js (for calendar view)
React Icons (for icons)
Backend (Dummy API):
Node.js
Express
TypeScript
Cors
Local Setup Instructions 💻
Follow these steps to run the application locally:

1. Prerequisites:
* Node.js (LTS version recommended) & npm (or yarn) installed.
* Code Editor (like VS Code).

2. Setup Backend (Dummy API):
* Clone or create the retro-buddy-api directory.
* Navigate into the directory:
  bash cd retro-buddy-api
* Install dependencies:
  bash npm install # or: yarn install
* Run the development server:
  bash npm run dev # or: yarn dev
* (The API should now be running, typically on http://localhost:4000)

3. Setup Frontend:
* Clone or create the my-retro-dashboard directory.
* If creating new, use Vite:
  bash npm create vite@latest my-retro-dashboard -- --template react-ts # or: yarn create vite my-retro-dashboard --template react-ts
* Navigate into the directory:
  bash cd my-retro-dashboard
* Replace the content of src/App.tsx with the final application code provided. Ensure imports/exports match your src/main.tsx.
* Install dependencies:
  bash npm install # or: yarn install
  (This installs React, Recharts, etc. If any dev dependencies are missing from the Vite template, install them: npm install --save-dev @types/react-select @types/react-big-calendar)
* Install and Initialize Tailwind CSS (if not done by template or previous steps):
  bash npm install --save-dev tailwindcss postcss autoprefixer npx tailwindcss init -p
* Configure tailwind.config.js: Ensure the content array includes ./src/**/*.{js,ts,jsx,tsx}.
* Configure src/index.css: Replace content with Tailwind directives (@tailwind base; @tailwind components; @tailwind utilities;).
* Import Calendar CSS: Add import "react-big-calendar/lib/css/react-big-calendar.css"; in src/main.tsx.
* Run the development server:
  bash npm run dev # or: yarn dev
* (The frontend should now be running, typically on http://localhost:5173)

4. Access: Open the frontend URL (e.g., http://localhost:5173) in your browser. Ensure the backend API is also running.

Future Enhancements 🔮
Real-time integration with Jira/Azure DevOps.
Real-time integration with Google/Outlook Calendar.
Slack/Teams bot integration for Kudos notifications & posting.
User Authentication & Authorization (SSO).
Persistence for Kudos data via the backend.
Advanced analytics (e.g., trend prediction, correlation analysis).
Customizable Insight rules.
Gamification for Kudos (leaderboards, badges).
Contributing
(Contributions are welcome! Please follow standard Fork & Pull Request workflows. Lint your code and ensure tests pass - if applicable.)

(Replace the above with your actual contribution guidelines.)

License
(Specify your project's license here, e.g., MIT License)
