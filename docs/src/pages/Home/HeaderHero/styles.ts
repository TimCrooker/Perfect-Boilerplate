import styled from 'styled-components'
import { Section } from '../../../components/core'

export const HeaderHeroWrapper = styled(Section)`
	padding-top: 20px;

	.TwoColumns .column {
		max-width: initial;
	}

	.socialLinks {
		display: flex;
		justify-content: flex-end;
		max-width: 1200px;
		margin: -10px auto 0;

		.twitter-follow-button,
		.github-button {
			margin-right: 1rem;
		}
	}

	.TwoColumns {
		align-items: center;
	}

	.title {
		font-size: 84px;
		color: var(--brand);
		line-height: 1;
		margin-top: 0;
		margin-bottom: 20px;
		font-weight: 500;
	}

	.tagline {
		font-size: 36px;
		line-height: 1.3;
		color: white;
		font-weight: 500;
	}

	.buttons {
		margin-top: 40px;
	}

	.image {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	@media only screen and (min-width: 997px) {
		.TwoColumns {
			grid-template-columns: 3fr 1fr;
		}

		.TwoColumns .column.left {
			padding-right: 0;
		}

		.TwoColumns .column.right {
			padding-left: 0;
		}
	}

	@media only screen and (min-width: 481px) and (max-width: 996px) {
		.column.first {
			display: flex;
			justify-content: center;
		}

		.column.last {
			text-align: center;
		}
	}

	@media only screen and (max-width: 760px) {
		.title {
			font-size: 60px;
		}

		.tagline {
			font-size: 30px;
		}

		.socialLinks {
			margin-top: -2rem;
		}
	}
`
