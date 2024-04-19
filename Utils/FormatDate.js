
function formatDate(date) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };

    const formattedDate = new Date(date).toLocaleDateString('en-US', options);

    return `${formattedDate}`;
}

module.exports = formatDate


