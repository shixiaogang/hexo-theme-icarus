const { Component } = require('inferno');
const gravatrHelper = require('hexo-util').gravatar;
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

class Profile extends Component {
    renderSocialLinks(links) {
        if (!links.length) {
            return null;
        }
        return <p class="social-links is-size-6 is-flex justify-content-start mt-2">
            {links.filter(link => typeof link === 'object').map(link => {
                return <a class="is-transparent mr-3" target="_blank" rel="noopener" title={link.name} href={link.url}>
                    {'icon' in link ? <i class={link.icon}></i> : link.name}
                </a>;
            })}
        </p>;
    }

    render() {
        const {
            avatar,
            avatarRounded,
            author,
            authorTitle,
            email,
            location,
            socialLinks
        } = this.props;
        return <div class="card widget" data-type="profile">
            <div class="card-content">
                <nav class="level">
                    <div class="level-item has-text-left flex-shrink-1">
                        <div>
                            <figure class="image mx-auto mb-2">
                                <img class={'avatar' + (avatarRounded ? ' is-rounded' : '')} src={avatar} alt={author} />
                            </figure>
                            {author ? <p class="title is-size-4 is-block" style={{'line-height': 'inherit'}}>{author}</p> : null}
                            {authorTitle ? <p class="is-size-6 is-block">{authorTitle}</p> : null}
                            {email ? <p class="is-size-6 is-flex justify-content-start mt-2">
                                <i class="fas fa-envelope mr-1"></i>
                                <span>{email}</span>
                            </p> : null}
                            {location ? <p class="is-size-6 is-flex justify-content-start mt-2">
                                <i class="fas fa-map-marker-alt mr-1"></i>
                                <span>{location}</span>
                            </p> : null}
                            {socialLinks ? this.renderSocialLinks(socialLinks) : null}
                        </div>
                    </div>
                </nav>
            </div>
        </div>;
    }
}

Profile.Cacheable = cacheComponent(Profile, 'widget.profile', props => {
    const { helper, widget } = props;
    const {
        avatar,
        gravatar,
        avatar_rounded = false,
        author = props.config.author,
        author_title,
        email,
        location,
        follow_link,
        social_links
    } = widget;
    const { url_for, __ } = helper;

    function getAvatar() {
        if (gravatar) {
            return gravatrHelper(gravatar, 128);
        }
        if (avatar) {
            return url_for(avatar);
        }
        return url_for('/img/avatar.png');
    }

    const socialLinks = social_links ? Object.keys(social_links).map(name => {
        const link = social_links[name];
        if (typeof link === 'string') {
            return {
                name,
                url: url_for(link)
            };
        }
        return {
            name,
            url: url_for(link.url),
            icon: link.icon
        };
    }) : null;

    return {
        avatar: getAvatar(),
        avatarRounded: avatar_rounded,
        author,
        authorTitle: author_title,
        email,
        location,
        followLink: follow_link ? url_for(follow_link) : undefined,
        followTitle: __('widget.follow'),
        socialLinks
    };
});

module.exports = Profile;
