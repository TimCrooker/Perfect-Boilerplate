import React from 'react'
import { CloudinaryContext, Image } from 'cloudinary-react'
import {
	ActionButtonWrapper,
	HeadingWrapper,
	SectionWrapper,
	TwoColumnsWrapper,
} from './styles'

interface SectionProps {
	element?: string
	children?: React.ReactElement
	className?: string
	background?: string
}
export function Section({
	children,
	className,
	background = 'light',
}: SectionProps): React.ReactElement {
	return (
		<SectionWrapper className={`${className} ${background}`}>
			{children}
		</SectionWrapper>
	)
}

interface HeadingProps {
	text: string
}
export function Heading({ text }: HeadingProps): React.ReactElement {
	return <HeadingWrapper className="Heading">{text}</HeadingWrapper>
}

interface ActionButtonProps {
	href: string
	type: 'primary' | 'secondary'
	target: string
	children: React.ReactElement | string
}
export function ActionButton({
	href,
	type = 'primary',
	target,
	children,
}: ActionButtonProps): React.ReactElement {
	return (
		<ActionButtonWrapper className={type} href={href} target={target}>
			{children}
		</ActionButtonWrapper>
	)
}

interface TextColumnProps {
	title?: string
	text?: string
	moreContent?: React.ReactElement
}
export function TextColumn({
	title,
	text,
	moreContent,
}: TextColumnProps): React.ReactElement {
	return (
		<>
			<Heading text={title} />
			<div dangerouslySetInnerHTML={{ __html: text }} />
			{moreContent}
		</>
	)
}

interface TwoColumnsProps {
	columnOne: React.ReactElement
	columnTwo: React.ReactElement
	reverse?: boolean
}
export function TwoColumns({
	columnOne,
	columnTwo,
	reverse,
}: TwoColumnsProps): React.ReactElement {
	return (
		<TwoColumnsWrapper className={reverse ? 'reverse' : ''}>
			<div className={`column first ${reverse ? 'right' : 'left'}`}>
				{columnOne}
			</div>
			<div className={`column last ${reverse ? 'left' : 'right'}`}>
				{columnTwo}
			</div>
		</TwoColumnsWrapper>
	)
}

interface ScreenRectProps {
	className?: string
	fill?: string
	stroke?: string
}
export function ScreenRect({
	className,
	fill,
	stroke,
}: ScreenRectProps): React.ReactElement {
	return (
		<rect
			className={`screen ${className || ''}`}
			rx="3%"
			width="180"
			height="300"
			x="-90"
			y="-150"
			fill={fill}
			stroke={stroke}
		/>
	)
}

interface SuperImageProps {
	publicId?: string
	imageUrl?: string
	cloudName?: string
}
export function SuperImage({
	publicId,
	imageUrl,
	cloudName,
}: SuperImageProps): React.ReactElement {
	return (
		<>
			<CloudinaryContext cloudName={cloudName ?? 'dfmg5c8l9'} secure="true">
				{publicId && <Image publicId={publicId} className="image" />}
				{imageUrl && <img src={imageUrl} className="image" />}
			</CloudinaryContext>
		</>
	)
}
