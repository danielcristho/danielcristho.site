export const RESUME_DATA = {
    name: "Daniel Pepuho",
    location: "Jayapura, Papua",
    about: "Senior Software Engineer focused on building products with extra attention to detail",
    summary:
        "As a Full Stack Engineer, I have successfully taken multiple products from 0 to 1. I lead teams effectively, ensuring an environment where people can do their best work. Currently, I work mostly with TypeScript, React, Node.js, and GraphQL. I have over 8 years of experience in working remotely with companies all around the world.",
    avatarUrl: "https://avatars.githubusercontent.com/u/13225220?v=4",
    personalWebsiteUrl: "https://danielcristho.site",
    contact: {
        email: "pepuhodaniel93@gmail.com",
        github: "danielcristho",
        linkedin: "daniel-pepuho",
        X: "chrstdan",
    },
    education: [
        {
            school: "Institut Teknologi Sepuluh Nopember",
            degree: "Bachelor's Degree in Informatics",
            start: "2020",
            end: "Present",
        },
    ],
    work: [
        {
            company: "PPDB JATIM",
            link: "https://ppdbjatim.net",
            badges: [],
            title: "IT Infra & DevOps",
            start: "2023",
            end: "2024",
            descriptions: [
                "Role as IT Infrastructure, Responsible for managing server websites, like creating",
                "CI/CD, building configuration management using Ansible, and creating automated scripts.",
                "This is my first experience using Docker in the Production Project.",
            ],
            usedTechnologies: [
                "React.js",
                "TypeScript",
                "Mobx",
                "Esri maps",
                "GitHub Actions",
                "Jetbrains TeamCity",
                "in-house front-end platform, and design system solutions",
            ],
        },
        {
            company: "PT. Internusa Total Solution",
            // link: "https://www.tidepoollabs.com/",
            badges: [],
            title: "IT Network Intern",
            start: "Jul 2019",
            end: "Oct 2019",
            descriptions: [
                "Responsible for maintaining internet service on the client side.",
                "Monitoring network performance to determine if adjustments need to be made.",
                "Network installation.",
            ],
            usedTechnologies: [
                "Mikrotik",
                "Cisco",
                "Unifi (Ubiqiti)"
            ],
        },

    ],
    skills: [
        "Docker",
        "Ansible",
        "MySQL/Mariadb",
        "PostgreSQL",
        "Python",
        "Cisco",
        "Mikrotik"
    ],
    projects: [
        {
            title: "danielcristho.site",
            techStack: ["Personal Project", "Astro", "Starlight"],
            description:
                "My personal website and blog. Built with Astro and Starlight",
            link: {
                label: "danielcristho.site",
                href: "https://danielcristho.site/",
            },
        },
        {
            title: "ppdbjatim.net",
            techStack: ["Next JS", "Laravel", "Docker", "Mariadb"],
            description:
                "I worked on both the front-end (React.js) app and a Chrome web extension.",
            link: {
                label: "8thmind.com",
                href: "https://www.8thmind.com/",
            },
        },
    ],
} as const;