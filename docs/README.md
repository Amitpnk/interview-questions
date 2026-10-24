# Interview Questions & Answers

[![Documentation](https://github.com/Amitpnk/interview-questions/actions/workflows/main.yaml/badge.svg)](https://github.com/Amitpnk/interview-questions/actions/workflows/main.yaml)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Amitpnk/interview-questions/blob/main/LICENSE)

Practical interview questions and answers for software engineers – from .NET, full stack and cloud to AI and Forward Deployed Engineer (FDE) roles, plus techno-managerial and manager rounds. Use it to crack your next tech interview, or as a question bank if you are a technical recruiter or team lead.

**Website:** [amitpnk.github.io/interview-questions](https://amitpnk.github.io/interview-questions)

<p float="left">
  <a href="https://amitpnk.github.io/interview-questions"><img alt="Cover page" src="https://raw.githubusercontent.com/Amitpnk/interview-questions/main/docs/img/screenshot-1.png" width="49%"></a>
  <a href="https://amitpnk.github.io/interview-questions"><img alt="Question page" src="https://raw.githubusercontent.com/Amitpnk/interview-questions/main/docs/img/screenshot-2.png" width="49%"></a>
</p>

## Topics

| Topic | Page |
| --- | --- |
| C# & OOP | [CsharpOops.md](CsharpOops.md) |
| .NET Fundamentals | [DotNetFundamental.md](DotNetFundamental.md) |
| ASP.NET Core | [DotnetCore.md](DotnetCore.md) |
| Web API | [API.md](API.md) |
| Coding Programs | [SimpleProgram.md](SimpleProgram.md) |
| Design Principles | [DesignPrinciple.md](DesignPrinciple.md) |
| Design Patterns | [DesignPattern.md](DesignPattern.md) |
| Microservices *(coming soon)* | [Microservices.md](Microservices.md) |
| Kafka *(coming soon)* | [Kafka.md](Kafka.md) |
| Software Architect | [SoftwareArchitect.md](SoftwareArchitect.md) |
| SQL Server | [SQLServer.md](SQLServer.md) |
| Angular | [Angular.md](Angular.md) |
| React *(coming soon)* | [React.md](React.md) |
| Azure *(coming soon)* | [Azure.md](Azure.md) |
| AWS *(coming soon)* | [AWS.md](AWS.md) |
| AI & LLM Fundamentals *(coming soon)* | [AIFundamentals.md](AIFundamentals.md) |
| Forward Deployed Engineer *(coming soon)* | [ForwardDeployedEngineer.md](ForwardDeployedEngineer.md) |
| Techno-Managerial Round *(coming soon)* | [TechnoManagerRound.md](TechnoManagerRound.md) |
| Manager Round *(coming soon)* | [ManagerRound.md](ManagerRound.md) |

## Project structure

```text
interview-questions/
├── docs/                   # Docsify website (published with GitHub Pages)
│   ├── index.html          # Docsify configuration and plugins
│   ├── index.md            # Home page
│   ├── _coverpage.md       # Cover page
│   ├── _sidebar.md         # Sidebar navigation
│   ├── *.md                # One page per topic
│   ├── assets/             # Custom CSS and site.js (docsify plugin)
│   └── img/                # Diagrams, logos and screenshots
├── src/
│   ├── ConsoleApp/         # C# samples used in the answers
│   └── SQLScript/          # SQL scripts for the SQL Server samples
├── .github/workflows/      # Builds PDF versions of the docs
└── TODO.md                 # Topics still to be added
```

## Run the site locally

```bash
npm install -g docsify-cli
docsify serve docs
```

Then open <http://localhost:3000>.

## Contributing

Each page uses the same layout, so new questions are easy to add:

- `#` – page title (one per page)
- `##` – category
- `###` – question, written as a question
- Code blocks use a language tag: `csharp`, `sql`, `ts`, `html`, `bash`, `json` or `text`
- Under each question, tag its difficulty: `<!-- level: beginner -->`, `<!-- level: intermediate -->` or `<!-- level: advanced -->` (shown as a badge on the site, hidden on GitHub)
- Callout boxes are blockquotes starting with a bold label: `> **Interview tip:** …`, `> **Common mistake:** …` or `> **Note:** …`
- Diagrams can be written as ` ```mermaid ` code blocks

The sidebar table of contents is generated from the headings automatically.

## Give a star :star:

If you like this project or use it to prepare for interviews, please give it a star. Thanks!

## Support this project

If you have found this project helpful, please consider buying me a coffee:

<a href="https://www.buymeacoffee.com/codewithamit" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important"></a>

## References

- Kudvenkat YouTube channel
- Shivprasad Koirala YouTube channel

## Contact

Having any issues? Drop a mail to amit.naik8103@gmail.com or [raise a bug or feature request](https://github.com/Amitpnk/interview-questions/issues/new). Always happy to help.
