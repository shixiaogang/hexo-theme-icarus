module.exports = hexo => {
    hexo.extend.tag.register('listing', function(args, content) {

        let title;

        const num_options = args.length;
        for (let i = 0; i < num_options; i++) {
            const colon = args[i].indexOf(':');
            if (colon === -1) {
                continue;
            }

            const key = args[i].slice(0, colon);
            const value = args[i].slice(colon + 1);

            switch (key) {
                case 'title':
                    title = value;
                    break;
                default:
                    // nothing to do
                    break;
            }
        }

        const lines = content.split(/\n+/);

        // Remove heading and trailing empty lines
        let headIndex = 0;
        while (headIndex < lines.length) {
            if (lines[headIndex]) {
                break;
            }
            headIndex++;
        }
        let tailIndex = lines.length - 1;
        while (tailIndex > headIndex) {
            if (lines[tailIndex]) {
                break;
            }
            tailIndex--;
        }
        const sliced_lines = lines.slice(headIndex, tailIndex + 1);

        let result = '<div class="listing">';
        if (title) {
            result += '<div class="listing-title">' +
                '<div class="level-left"><strong>' + title + '</strong></div>' +
                '</div>';
        }

        result += '<div class="listing-body"><table><tbody>';
        for (let i = 0; i < sliced_lines.length; i++) {
            const line = sliced_lines[i];
            const rendered_line = hexo.render.renderSync({text: line, engine: 'markdown'});

            result += '<tr>' +
                '<td class="gutter">' + i + '</td>' +
                '<td class="code">' + rendered_line + '</td>' +
                '</tr>';
        }
        result += '</tbody></table></div>';
        result += '</div>';

        return result;

    }, {ends: true});
}