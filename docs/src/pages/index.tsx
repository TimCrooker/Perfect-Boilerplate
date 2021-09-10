import React from 'react'
import Layout from '@theme/Layout'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import HeaderHero from './Home/HeaderHero'
import NativeApps from './Home/NativeApps'
import GetStarted from './Home/GetStarted'
import useBaseUrl from '@docusaurus/useBaseUrl'
import { ActionButton } from '../components/core'

export const textContent = {
	intro: `
React Native combines the best parts of native development with React,
a best-in-class JavaScript library for building user interfaces.
<br/><br/>
<strong>Use a little—or a lot</strong>. You can use React Native today in your existing
Android and iOS projects or you can create a whole new app from scratch.
  `,
	nativeCode: `
React primitives render to native platform UI, meaning your app uses the
same native platform APIs other apps do.
<br/><br/>
<strong>Many platforms</strong>, one React. Create platform-specific versions of components
so a single codebase can share code across platforms. With React Native,
one team can maintain two platforms and share a common technology—React.
  `,
	codeExample: `
import React from 'react';
import {Text, View} from 'react-native';
import {Header} from './Header';
import {heading} from './Typography';
const WelcomeScreen = () => (
  <View>
    <Header title="Welcome to React Native"/>
    <Text style={heading}>Step One</Text>
    <Text>
      Edit App.js to change this screen and turn it
      into your app.
    </Text>
    <Text style={heading}>See Your Changes</Text>
    <Text>
      Press Cmd + R inside the simulator to reload
      your app’s code.
    </Text>
    <Text style={heading}>Debug</Text>
    <Text>
      Press Cmd + M or Shake your device to open the
      React Native Debug Menu.
    </Text>
    <Text style={heading}>Learn</Text>
    <Text>
      Read the docs to discover what to do next:
    </Text>
   </View>
);
  `,
	forEveryone: `
React Native lets you create truly native apps and doesn't compromise your users' experiences.
It provides a core set of platform agnostic native components like <code>View</code>, <code>Text</code>, and <code>Image</code>
that map directly to the platform’s native UI building blocks.
  `,
	crossPlatform: `
React components wrap existing native code and interact with native APIs via
React’s declarative UI paradigm and JavaScript. This enables native app development
for whole new teams of developers, and can let existing native teams work much faster.
  `,
	fastRefresh: `
<strong>See your changes as soon as you save.</strong> With the power of JavaScript,
React Native lets you iterate at lightning speed. No more waiting for native builds to finish.
Save, see, repeat.
  `,
	talks: `
Members of the React Native team frequently speak at various conferences.
<br/><br/>
You can follow the latest news from the React Native team on Twitter
  `,
}
export function HomeCallToAction(): React.ReactElement {
	return (
		<>
			<ActionButton
				type="primary"
				href={useBaseUrl('docs/getting-started')}
				target="_self"
			>
				Get started
			</ActionButton>
			<ActionButton
				type="secondary"
				href={useBaseUrl('docs/tutorial')}
				target="_self"
			>
				Learn basics
			</ActionButton>
		</>
	)
}

function HomeWrapper(): React.ReactElement {
	const { siteConfig } = useDocusaurusContext()
	return (
		<Layout
			description="Description will go into a meta tag in <head />"
			wrapperClassName="homepage"
		>
			<HeaderHero />
			<main>
				<NativeApps />
				<GetStarted />
			</main>
		</Layout>
	)
}

export default HomeWrapper
