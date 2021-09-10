import React from 'react'
import './core.scss'

interface SectionProps {
	element?: string
	children?: React.ReactElement
	className?: string
	background?: string
}
export function Section({
	element = 'section',
	children,
	className,
	background = 'light',
}: SectionProps): React.ReactElement {
	const El = element
	return <El className={`Section ${className} ${background}`}>{children}</El>
}

interface HeadingProps {
	text: string
}
export function Heading({ text }: HeadingProps): React.ReactElement {
	return <h2 className="Heading">{text}</h2>
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
		<a className={`ActionButton ${type}`} href={href} target={target}>
			{children}
		</a>
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
		<div className={`TwoColumns ${reverse ? 'reverse' : ''}`}>
			<div className={`column first ${reverse ? 'right' : 'left'}`}>
				{columnOne}
			</div>
			<div className={`column last ${reverse ? 'left' : 'right'}`}>
				{columnTwo}
			</div>
		</div>
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

export function LogoAnimation(): React.ReactElement {
	return (
		<svg
			className="LogoAnimation init"
			width={350}
			height={350}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="-200 -200 400 400"
		>
			<title>React Logo</title>
			<clipPath id="screen">
				<ScreenRect fill="none" stroke="gray" />
			</clipPath>
			<rect
				x="-25"
				y="120"
				width="50"
				height="25"
				rx="2"
				fill="white"
				stroke="none"
				className="stand"
			/>
			<polygon
				points="-125,90 125,90 160,145 -160,145"
				fill="white"
				stroke="white"
				strokeWidth="5"
				strokeLinejoin="round"
				className="base"
			/>
			<ScreenRect className="background" stroke="none" />
			<g clipPath="url(#screen)" className="logo">
				<g className="logoInner">
					<circle cx="0" cy="0" r="30" fill="#61dafb" />
					<g stroke="#61dafb" strokeWidth="15" fill="none" id="logo">
						<ellipse rx="165" ry="64" />
						<ellipse rx="165" ry="64" transform="rotate(60)" />
						<ellipse rx="165" ry="64" transform="rotate(120)" />
					</g>
				</g>
				<line
					x1="-30"
					x2="30"
					y1="130"
					y2="130"
					stroke="white"
					strokeWidth="8"
					strokeLinecap="round"
					className="speaker"
				/>
			</g>
			<ScreenRect fill="none" stroke="white" />
		</svg>
	)
}

