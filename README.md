# AgentCoach 🎧

AgentCoach is a cutting-edge platform designed to simulate call center interactions. It leverages AI to provide realistic training scenarios, allowing customer service representatives to practice, refine their skills, and receive instant feedback without the pressure of a live environment.

## 🚀 Features

- **Realistic Call Simulation**: Engage in lifelike voice conversations powered by advanced AI models.
- **Dynamic Scenarios**: Practice with various customer personas and difficulty levels, from technical support to billing inquiries.
- **Instant AI Feedback**: Receive immediate, actionable feedback on performance, empathy, problem-solving, and communication skills.
- **Session History**: Track progress over time with detailed session logs and metrics.
- **Customizable Experience**: Easily adjust settings to fit specific training needs.

## 📋 Requirements

To run AgentCoach locally, you need the following prerequisites installed on your system:

- **Node.js**: Version 18.17.0 or higher
- **npm** or **yarn** or **pnpm**
- **OpenAI API Key**: Required to power the AI simulation and evaluation engine.

## 🛠️ Tech Stack

AgentCoach is built with modern web technologies:

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **AI Integration**: OpenAI Realtime API

## 💻 Getting Started

Follow these steps to set up the project locally.

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/agent-coach.git
cd agent-coach
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root of the project by copying the example file:

```bash
cp .env.example .env.local
```

Open `.env.local` and add your OpenAI API Key:

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 4. Run the Development Server

Start the application in development mode:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application running.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/agent-coach/issues) if you want to contribute.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
