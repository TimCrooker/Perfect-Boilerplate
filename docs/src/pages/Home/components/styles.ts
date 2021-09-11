import styled from 'styled-components'

export const FeatureWrapper = styled.div`
	padding: 0 16px 0 16px;
	margin: 12px 0 12px 0;
	width: 17%;

	@media screen and (max-width: 996px) {
		width: 100%;
		flex-basis: 50% !important;
	}

	.image {
		height: 50px;
		width: 50px;
	}

	h3 {
		font-size: 1rem;
		text-align: center;
	}
`
