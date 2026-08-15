const fs = require('fs');
const path = require('path');
const { getBundleName, selectFiles } = require('./bundle-target');

const bundlesDir = path.join(__dirname, 'resume-bundles');
const outputDir = path.join(__dirname, 'generated-templates');

async function generateBundle(file) {
    const bundlePath = path.join(bundlesDir, file);
    const data = await fs.promises.readFile(bundlePath, 'utf8');

    let resume;
    try {
        resume = JSON.parse(data);
    } catch (error) {
        throw new Error(`Error parsing JSON in ${file}: ${error.message}`);
    }

    const outputName = path.basename(file, '.json') + '.html';
    const outputPath = path.join(outputDir, outputName);
    await fs.promises.writeFile(outputPath, generateHTML(resume));
    console.log(`Generated ${outputName}`);
}

async function main() {
    const bundleName = getBundleName(process.argv.slice(2));
    fs.mkdirSync(outputDir, { recursive: true });

    const files = selectFiles(bundlesDir, '.json', bundleName);
    await Promise.all(files.map(generateBundle));
}

main().catch(error => {
    console.error('Error generating HTML:', error.message);
    process.exit(1);
});

function generateHTML(resume) {
    const processText = (text) => {
        if (!text) return text;
        return text.replace(/\[b\]/g, '<b>').replace(/\[\/b\]/g, '</b>');
    };

    return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${processText(resume.basics.name)} resume</title>
    <link rel="stylesheet" href="../styles.css" />
</head>

<body>
    <header>
        <h1 id="full-name">
            <p class="first">${processText(resume.basics.name.split(' ')[0])}</p>
            <p class="last">${processText(resume.basics.name.split(' ').slice(1).join(' '))}</p>
        </h1>
        <p class="contact-me">
            ${resume.basics.contact.location ? `${processText(resume.basics.contact.location)} | ` : ''}${processText(resume.basics.contact.phone)} |
            <a href="mailto:${resume.basics.contact.email}">${processText(resume.basics.contact.email)}</a>${resume.basics.contact.github ? ` |
            <a href="${resume.basics.contact.github}">github</a>` : ''}${resume.basics.contact.linkedin ? ` |
            <a href="${resume.basics.contact.linkedin}">linkedin</a>` : ''}
        </p>
    </header>

    <main>
        ${resume.summary ? `
        <section id="summary"${resume.additionalStylings && resume.additionalStylings['summary'] ? ` style="${resume.additionalStylings['summary']}"` : ''}>
            <p style="text-align: center; font-style: italic;">${processText(resume.summary)}</p>
        </section>
        ` : ''}

        ${resume.professional_highlights ? `
        <section id="professional-highlights"${resume.additionalStylings && resume.additionalStylings['professional-highlights'] ? ` style="${resume.additionalStylings['professional-highlights']}"` : ''}>
            <h2>PROFESSIONAL HIGHLIGHTS</h2>
            <div class="highlights">
                <ul>
${resume.professional_highlights.map(item => `                    <li>${processText(item)}</li>`).join('\n')}
                </ul>
            </div>
        </section>
        ` : ''}

        ${resume.experience ? `
        <section id="experience"${resume.additionalStylings && resume.additionalStylings['experience'] ? ` style="${resume.additionalStylings['experience']}"` : ''}>
            <h2>EXPERIENCE</h2>
${resume.experience.map((exp, index) => `
            <div class="project${index === 0 ? ' mt-0' : ''}">
                <h3>${processText(exp.company)} <span class="description">&#160;|&#160;${processText(exp.role)}</span></h3>
                <p class="location">${processText(exp.period)} | ${processText(exp.location)}</p>
                ${exp.tech_stack ? `<p class="description">${processText(exp.tech_stack)}</p>` : ''}
                <ul>
${exp.highlights.map(highlight => `                    <li>${processText(highlight)}</li>`).join('\n')}
                </ul>
            </div>
`).join('')}
        </section>
        ` : ''}

        ${resume.projects ? `
        <section id="projects"${resume.additionalStylings && resume.additionalStylings['projects'] ? ` style="${resume.additionalStylings['projects']}"` : ''}>
            <h2>PROJECTS</h2>
${resume.projects.map((proj, index) => `
            <div class="project${index === 0 ? ' mt-0' : ''}">
                <h3>${processText(proj.name)} <span class="description">&#160;|&#160;${processText(proj.role)}</span></h3>
                <p class="location">${processText(proj.period || '')} ${proj.location ? `| ${processText(proj.location)}` : ''}</p>
                ${proj.tech_stack ? `<p class="description">${processText(proj.tech_stack)}</p>` : ''}
                <ul>
${proj.highlights.map(highlight => `                    <li>${processText(highlight)}</li>`).join('\n')}
                </ul>
            </div>
`).join('')}
        </section>
        ` : ''}

        ${resume.skills ? `
        <section id="skills"${resume.additionalStylings && resume.additionalStylings['skills'] ? ` style="${resume.additionalStylings['skills']}"` : ''}>
            <h2>SKILLS</h2>
${resume.skills.map((skill, index) => `
            <div class="skill-category${index === 0 ? ' mt-0' : ''}">
                <span>${processText(skill.category)}: </span>${processText(skill.items)}
            </div>
`).join('')}
        </section>
        ` : ''}

        ${resume.certifications ? `
        <section id="certifications"${resume.additionalStylings && resume.additionalStylings['certifications'] ? ` style="${resume.additionalStylings['certifications']}"` : ''}>
            <h2>CERTIFICATIONS</h2>
${resume.certifications.map(cert => `
            <div class="certificate">
                <h3>${processText(cert)}</h3>
            </div>
`).join('')}
        </section>
        ` : ''}

        ${resume.achievements ? `
        <section id="achievements"${resume.additionalStylings && resume.additionalStylings['achievements'] ? ` style="${resume.additionalStylings['achievements']}"` : ''}>
            <h2>ACHIEVEMENTS</h2>
            <div class="highlights">
                <ul>
${resume.achievements.map(item => `                    <li>${processText(item)}</li>`).join('\n')}
                </ul>
            </div>
        </section>
        ` : ''}

        ${resume.education ? `
        <section id="education"${resume.additionalStylings && resume.additionalStylings['education'] ? ` style="${resume.additionalStylings['education']}"` : ''}>
            <h2>EDUCATION</h2>
${resume.education.map(edu => `
            <div class="qualification">
                <h3>${processText(edu.institution)} <span class="description">&#160;|&#160;${processText(edu.degree)}</span></h3>
                <p class="location">${processText(edu.period)} | ${processText(edu.location)}</p>
                ${edu.score ? `<p class="location">${processText(edu.score)}</p>` : ''}
                ${edu.description ? `<p class="description">${processText(edu.description)}</p>` : ''}
            </div>
`).join('')}
        </section>
        ` : ''}

    </main>
</body>

</html>`;
}
