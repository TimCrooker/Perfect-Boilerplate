import styled from 'styled-components'

export const ActionButtonWrapper = styled.a`
	padding: 0.75rem 1.5rem;
	text-align: center;
	font-size: 1.25rem;
	font-weight: 400;
	text-decoration: none !important;
	border-bottom: none;
	transition: all 0.2s ease-out;
	max-width: 50%;

	&.primary {
		color: var(--dark);
		background-color: var(--brand);

		&:hover {
			color: black;
			background-color: white;
		}
	}

	&.secondary {
		background: none;
		color: var(--brand);

		&::after {
			content: '›';
			font-size: 24px;
			margin-left: 5px;
		}

		&:hover {
			color: white;
		}
	}

	@media only screen and (max-width: 480px) {
		max-width: 100%;
		width: 100%;
		display: block;
		white-space: nowrap;
	}
`

export const SectionWrapper = styled.section`
	@import '../../css/shared';

	width: 100%;
	padding-top: 50px;
	padding-bottom: 50px;
	overflow-x: hidden;

	&.Section {
		border-top: 1px solid var(--ifm-table-border-color);
	}

	&.tint {
		background-color: var(--ifm-menu-color-background-active);
	}

	&.dark {
		background-color: var(--dark);
	}

	p a {
		@extend %link-style;
	}

	html[data-theme='dark'] p a {
		@extend %link-style-dark;
	}
`

export const TwoColumnsWrapper = styled.div`
	display: grid;

	.column {
		width: 100%;

		&.first {
			grid-area: first;
		}

		&.last {
			grid-area: last;
		}
	}

	@media only screen and (min-width: 961px) {
		max-width: 900px;
		margin: 0 auto;
		grid-template-columns: repeat(2, 1fr);
		grid-template-areas: 'first last';

		&.reverse {
			grid-template-areas: 'last first';
		}

		.column {
			max-width: 450px;

			&.left {
				padding-right: 50px;
			}

			&.right {
				padding-left: 50px;
			}
		}
	}

	@media only screen and (max-width: 960px) {
		&.reverse {
			grid-template-columns: 1fr;
			grid-template-areas: 'first' 'last';
		}

		.column {
			padding: 0 4rem;
		}
	}

	@media only screen and (max-width: 480px) {
		.column {
			padding: 0 1.25rem;
		}
	}
`

export const HeadingWrapper = styled.h2`
	font-size: 25px;
	color: var(--ifm-font-color-base);
	line-height: 1.2;
	margin-top: 0;
	margin-bottom: 20px;
	font-weight: 700;
`