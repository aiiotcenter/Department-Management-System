import ProjectsCarousel from '../components/ProjectsCarousel';

const projects = [
    {
        title: 'Beekeeping and Technologies',
        url: 'https://youtu.be/VJZlVgf44FA',
        thumbnail: 'https://img.youtube.com/vi/VJZlVgf44FA/hqdefault.jpg',
    },
    {
        title: 'Bitcoin & Blockchain 1 - PROF. DR. FADI AL-TURJMAN',
        url: 'https://youtu.be/pCLZnfbQ6ow',
        thumbnail: 'https://img.youtube.com/vi/pCLZnfbQ6ow/hqdefault.jpg',
    },
    {
        title: 'Bitcoin & Blockchain 2 - PROF. DR. FADI AL-TURJMAN',
        url: 'https://youtu.be/cNlAtNxhzcQ',
        thumbnail: 'https://img.youtube.com/vi/cNlAtNxhzcQ/hqdefault.jpg',
    },
    {
        title: 'Prof. DUX, AI learning facilitator',
        url: 'https://youtu.be/VQVQFTO9ZRo',
        thumbnail: 'https://img.youtube.com/vi/VQVQFTO9ZRo/hqdefault.jpg',
    },
    {
        title: 'Mobile App for Campus Facility Detection',
        url: 'https://youtu.be/h6dQoYLVeng',
        thumbnail: 'https://img.youtube.com/vi/h6dQoYLVeng/hqdefault.jpg',
    },
];

function Projects() {
    return (
        <div>
            <ProjectsCarousel projects={projects} />
        </div>
    );
}

export default Projects;
