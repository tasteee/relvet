import { layout, text } from '#/components'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { Button } from '#/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { $auth } from '#/stores/$auth'
import { Icon } from '@iconify/react'
import { Badge } from '#/components/ui/badge'

// navbar at top. has logo on left, links in middle,
// and user / settings on the right (with settings icon
// and user avatar that drops down to show user options).

// site views: /home, /browse, /library
// library and collection are only for authed users

// home page shouuld show sections: Progressions, Patterns
// each section should have a <Tabs /> to switch between "Hot", "Top", "New"
// each section should show a grid of items, with title, description, and tags
// based off of mock data for right now.

import { useDatass } from 'datass'
import { observer } from 'mobx-react-lite'
import { NavBar } from './navbar'

const HomeSection = (props) => {
	const activeTab = useDatass.string('hot')
	const mockDataLookup = props.label.toLowerCase()
	const mockData = MOCK_DATA[mockDataLookup]
	const tabData = mockData[activeTab.state] || []

	return (
		<layout.column className='HomeSection gap-4 px-2'>
			<layout.row className='sectionHeader items-center justify-between gap-2'>
				<text.h1>{props.label}</text.h1>
				<Tabs value={activeTab.state} className='items-center' onValueChange={(value) => activeTab.set(value)}>
					<TabsList>
						<TabsTrigger value='hot'>Hot</TabsTrigger>
						<TabsTrigger value='top'>Top</TabsTrigger>
						<TabsTrigger value='new'>New</TabsTrigger>
					</TabsList>
				</Tabs>
			</layout.row>
			<layout.row className='tabContent'>
				<HomeItemGrid items={tabData} />
			</layout.row>
		</layout.column>
	)
}

const HomeItemGrid = (props) => {
	return (
		<layout.row className='flex-wrap gap-4'>
			{props.items.map((item) => (
				<HomeCard key={item.id} id={item.id} title={item.title} description={item.description} tags={item.tags} user={item.user} />
			))}
		</layout.row>
	)
}

const HomeCard = (props) => {
	return (
		<div id={props.id} className='border p-4 rounded w-[350px]'>
			<h3 className='font-bold'>{props.title}</h3>
			<layout.row className='items-center gap-2 mt-1 mb-2'>
				<Avatar className='w-6 h-6'>
					<AvatarImage src={props.user.avatar} alt={props.user.username} />
					<AvatarFallback>{props.user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
				</Avatar>
				<span className='text-sm text-gray-600 fontSecondary'>{props.user.username}</span>
			</layout.row>
			<p>{props.description}</p>
			<layout.row wrap pt='2' gap='2'>
				{props.tags.map((tag) => (
					<Badge key={tag} variant='default'>
						{tag}
					</Badge>
				))}
			</layout.row>
		</div>
	)
}

export const Home = () => {
	return (
		<layout.column className='Home gap-4 pb-[24px]'>
			<NavBar />
			<layout.column className='px-4 gap-6'>
				<HomeSection label='Progressions' />
				<HomeSection label='Patterns' />
			</layout.column>
		</layout.column>
	)
}

const MOCK_DATA = {
	progressions: {
		hot: [
			{
				id: 1,
				title: 'Jazz II-V-I',
				description: 'Classic jazz progression in C major',
				tags: ['jazz', 'major', 'classic'],
				user: { username: 'jazzmaster', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jazzmaster' },
			},
			{
				id: 2,
				title: 'Lo-Fi Hip Hop Chords',
				description: 'Dreamy progression perfect for chill beats',
				tags: ['lofi', 'chill', 'minor'],
				user: { username: 'chillbeats', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chillbeats' },
			},
			{
				id: 3,
				title: 'Neo Soul Pocket',
				description: 'Rich extended chords with smooth voice leading',
				tags: ['neo-soul', 'extended', 'smooth'],
				user: { username: 'soulvibes', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=soulvibes' },
			},
			{
				id: 4,
				title: 'Trap Progression',
				description: 'Dark minor progression for modern trap beats',
				tags: ['trap', 'dark', 'minor'],
				user: { username: 'trapgod', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=trapgod' },
			},
			{
				id: 5,
				title: 'Gospel Turnaround',
				description: 'Soulful progression with gospel flavor',
				tags: ['gospel', 'soul', 'church'],
				user: { username: 'gospelkeys', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gospelkeys' },
			},
			{
				id: 6,
				title: 'Indie Pop Progression',
				description: 'Bright and uplifting chord sequence',
				tags: ['indie', 'pop', 'uplifting'],
				user: { username: 'indievibes', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=indievibes' },
			},
			{
				id: 7,
				title: 'R&B Groove',
				description: 'Smooth R&B progression with 7th chords',
				tags: ['rnb', 'smooth', 'groove'],
				user: { username: 'smoothrnb', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=smoothrnb' },
			},
			{
				id: 8,
				title: 'Afrobeats Vibe',
				description: 'Rhythmic progression for afrobeats production',
				tags: ['afrobeats', 'rhythmic', 'world'],
				user: { username: 'afroking', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=afroking' },
			},
		],
		top: [
			{
				id: 9,
				title: 'vi-IV-I-V Pop',
				description: 'Most popular progression in modern music',
				tags: ['pop', 'popular', 'major'],
				user: { username: 'popstar', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=popstar' },
			},
			{
				id: 10,
				title: 'Circle of Fifths',
				description: 'Complete circle progression for jazz standards',
				tags: ['jazz', 'theory', 'advanced'],
				user: { username: 'theorygeek', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=theorygeek' },
			},
			{
				id: 11,
				title: 'Dorian Vamp',
				description: 'Modal progression using dorian mode',
				tags: ['modal', 'dorian', 'vamp'],
				user: { username: 'modalman', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=modalman' },
			},
			{
				id: 12,
				title: 'Blues Progression',
				description: 'Traditional 12-bar blues in multiple keys',
				tags: ['blues', 'traditional', '12-bar'],
				user: { username: 'blueslegend', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=blueslegend' },
			},
			{
				id: 13,
				title: 'Bossa Nova Changes',
				description: 'Sophisticated bossa nova chord progression',
				tags: ['bossa-nova', 'latin', 'sophisticated'],
				user: { username: 'bossanova', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bossanova' },
			},
			{
				id: 14,
				title: 'Funk Progression',
				description: 'Groovy progression perfect for funk tracks',
				tags: ['funk', 'groovy', 'rhythm'],
				user: { username: 'funkmaster', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=funkmaster' },
			},
			{
				id: 15,
				title: 'House Music Chords',
				description: 'Four-on-the-floor house progression',
				tags: ['house', 'electronic', 'dance'],
				user: { username: 'housedj', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=housedj' },
			},
			{
				id: 16,
				title: 'Emo Progression',
				description: 'Emotional progression for alternative rock',
				tags: ['emo', 'alternative', 'emotional'],
				user: { username: 'emorocker', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emorocker' },
			},
		],
		new: [
			{
				id: 17,
				title: 'Future Bass Drop',
				description: 'Modern future bass chord progression',
				tags: ['future-bass', 'electronic', 'modern'],
				user: { username: 'futurebass', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=futurebass' },
			},
			{
				id: 18,
				title: 'Ambient Textures',
				description: 'Atmospheric progression for ambient music',
				tags: ['ambient', 'atmospheric', 'texture'],
				user: { username: 'ambientmaker', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ambientmaker' },
			},
			{
				id: 19,
				title: 'UK Drill Progression',
				description: 'Dark and aggressive UK drill chords',
				tags: ['uk-drill', 'dark', 'aggressive'],
				user: { username: 'ukdrill', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ukdrill' },
			},
			{
				id: 20,
				title: 'Synthwave Retro',
				description: 'Nostalgic 80s synthwave progression',
				tags: ['synthwave', 'retro', '80s'],
				user: { username: 'synthwave80s', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=synthwave80s' },
			},
			{
				id: 21,
				title: 'Melodic Dubstep',
				description: 'Emotional melodic dubstep chord sequence',
				tags: ['dubstep', 'melodic', 'emotional'],
				user: { username: 'melodubstep', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=melodubstep' },
			},
			{
				id: 22,
				title: 'Phonk Progression',
				description: 'Memphis-inspired phonk chord progression',
				tags: ['phonk', 'memphis', 'underground'],
				user: { username: 'phonkproducer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=phonkproducer' },
			},
			{
				id: 23,
				title: 'Drill Progression',
				description: 'Hard-hitting drill chord sequence',
				tags: ['drill', 'hard', 'urban'],
				user: { username: 'drillking', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=drillking' },
			},
			{
				id: 24,
				title: 'Hyperpop Chords',
				description: 'Experimental hyperpop progression',
				tags: ['hyperpop', 'experimental', 'digital'],
				user: { username: 'hyperpopstar', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hyperpopstar' },
			},
		],
	},

	patterns: {
		hot: [
			{
				id: 25,
				title: 'Trap Hi-Hat Roll',
				description: 'Classic trap hi-hat pattern with rolls',
				tags: ['trap', 'hi-hat', 'rolls'],
				user: { username: 'hihatgod', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hihatgod' },
			},
			{
				id: 26,
				title: 'Afrobeats Rhythm',
				description: 'Infectious afrobeats drum pattern',
				tags: ['afrobeats', 'rhythm', 'percussion'],
				user: { username: 'afrorhythm', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=afrorhythm' },
			},
			{
				id: 27,
				title: 'Lo-Fi Shuffle',
				description: 'Laid-back shuffle pattern for lo-fi beats',
				tags: ['lofi', 'shuffle', 'laid-back'],
				user: { username: 'lofishuffle', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lofishuffle' },
			},
			{
				id: 28,
				title: 'Boom Bap Classic',
				description: 'Old school boom bap drum pattern',
				tags: ['boom-bap', 'classic', 'hip-hop'],
				user: { username: 'boombaphead', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=boombaphead' },
			},
			{
				id: 29,
				title: 'House Groove',
				description: 'Four-on-the-floor house pattern',
				tags: ['house', 'groove', 'dance'],
				user: { username: 'housegroove', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=housegroove' },
			},
			{
				id: 30,
				title: 'Drill Pattern',
				description: 'Hard-hitting drill drum sequence',
				tags: ['drill', 'hard', 'pattern'],
				user: { username: 'drillpattern', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=drillpattern' },
			},
			{
				id: 31,
				title: 'Jazz Swing',
				description: 'Swinging jazz drum pattern',
				tags: ['jazz', 'swing', 'traditional'],
				user: { username: 'jazzswing', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jazzswing' },
			},
			{
				id: 32,
				title: 'Funk Break',
				description: 'Syncopated funk drum break',
				tags: ['funk', 'break', 'syncopated'],
				user: { username: 'funkbreak', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=funkbreak' },
			},
		],
		top: [
			{
				id: 33,
				title: 'Basic 4/4 Rock',
				description: 'Standard rock drum pattern',
				tags: ['rock', 'basic', '4/4'],
				user: { username: 'rockdrummer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rockdrummer' },
			},
			{
				id: 34,
				title: 'Reggae One Drop',
				description: 'Classic reggae one drop pattern',
				tags: ['reggae', 'one-drop', 'classic'],
				user: { username: 'reggaebeat', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reggaebeat' },
			},
			{
				id: 35,
				title: 'Latin Clave',
				description: 'Traditional latin clave rhythm',
				tags: ['latin', 'clave', 'traditional'],
				user: { username: 'latinclave', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=latinclave' },
			},
			{
				id: 36,
				title: 'Breakbeat Pattern',
				description: 'Chopped up breakbeat sample',
				tags: ['breakbeat', 'chopped', 'sample'],
				user: { username: 'breakbeater', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=breakbeater' },
			},
			{
				id: 37,
				title: 'Techno Pattern',
				description: 'Driving techno kick pattern',
				tags: ['techno', 'driving', 'electronic'],
				user: { username: 'technokick', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=technokick' },
			},
			{
				id: 38,
				title: 'R&B Groove',
				description: 'Smooth R&B drum groove',
				tags: ['rnb', 'smooth', 'groove'],
				user: { username: 'rnbgroove', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rnbgroove' },
			},
			{
				id: 39,
				title: 'Country Shuffle',
				description: 'Country music shuffle pattern',
				tags: ['country', 'shuffle', 'americana'],
				user: { username: 'countryshuffle', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=countryshuffle' },
			},
			{
				id: 40,
				title: 'Punk Rock Beat',
				description: 'Fast and aggressive punk pattern',
				tags: ['punk', 'fast', 'aggressive'],
				user: { username: 'punkrocker', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=punkrocker' },
			},
		],
		new: [
			{
				id: 41,
				title: 'Hyperpop Glitch',
				description: 'Glitchy hyperpop drum pattern',
				tags: ['hyperpop', 'glitch', 'experimental'],
				user: { username: 'glitchmaster', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=glitchmaster' },
			},
			{
				id: 42,
				title: 'Phonk Pattern',
				description: 'Memphis-inspired phonk drums',
				tags: ['phonk', 'memphis', 'underground'],
				user: { username: 'phonkbeats', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=phonkbeats' },
			},
			{
				id: 43,
				title: 'UK Drill Pattern',
				description: 'Aggressive UK drill drum sequence',
				tags: ['uk-drill', 'aggressive', 'uk'],
				user: { username: 'ukdrillmaker', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ukdrillmaker' },
			},
			{
				id: 44,
				title: 'Future Garage',
				description: 'Atmospheric future garage pattern',
				tags: ['future-garage', 'atmospheric', 'garage'],
				user: { username: 'futuregarage', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=futuregarage' },
			},
			{
				id: 45,
				title: 'Drill Type Beat',
				description: 'Modern drill type beat pattern',
				tags: ['drill', 'type-beat', 'modern'],
				user: { username: 'typebeatmaker', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=typebeatmaker' },
			},
			{
				id: 46,
				title: 'Wave Pattern',
				description: 'Dreamy wave music drum pattern',
				tags: ['wave', 'dreamy', 'ambient'],
				user: { username: 'wavepattern', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wavepattern' },
			},
			{
				id: 47,
				title: 'Pluggnb Pattern',
				description: 'Melodic pluggnb drum sequence',
				tags: ['pluggnb', 'melodic', 'rnb'],
				user: { username: 'pluggnb', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pluggnb' },
			},
			{
				id: 48,
				title: 'Synthwave Beat',
				description: 'Retro synthwave drum pattern',
				tags: ['synthwave', 'retro', 'electronic'],
				user: { username: 'synthwavebeat', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=synthwavebeat' },
			},
		],
	},
}
