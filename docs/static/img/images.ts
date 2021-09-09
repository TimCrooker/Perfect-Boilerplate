const BOTSEA_LOGOS = 'botsea/branding/logo/'
const URL_PREFIX =
	'https://res.cloudinary.com/dfmg5c8l9/image/upload/v1631209481/'

export function cloudinaryUrl(publicId: string): string {
	return URL_PREFIX + publicId
}

export const IMAGES = {
	social_logo: BOTSEA_LOGOS + 'social_icon',

	full_logo: BOTSEA_LOGOS + 'full',

	icon_logo: BOTSEA_LOGOS + 'icon',
}

export default IMAGES
