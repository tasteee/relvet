import { useId, useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select'

const LABEL_TW_CLASSES =
	'bg-background text-foreground absolute start-1 top-[2px] z-10 block -translate-y-1/2 px-2 text-xs font-medium group-has-disabled:opacity-50 inline'

type PropsT = {}

export const FontSelect = (props: PropsT) => {
	const id = useId()
	const [selectedFont, setSelectedFont] = useState<string>('')
	const entries = Object.entries(fonts)

	const applyGlobalFont = (fontKey: string) => {
		const htmlElement = document.documentElement
		htmlElement.style.setProperty('font-family', `var(${fontKey})`, 'important')
	}

	const handleFontChange = (value: string) => {
		setSelectedFont(value)
		applyGlobalFont(value)
	}

	useEffect(() => {
		const defaultFont = '--fontGolosText'
		setSelectedFont(defaultFont)
		applyGlobalFont(defaultFont)
	}, [])

	const fontOptions = entries.map(([key, value]) => (
		<SelectItem key={key} value={key}>
			{value}
		</SelectItem>
	))

	return (
		<div className='relative pt-[3px]'>
			<div className='group relative pt-[2px]'>
				<label htmlFor={id} className={`fontSelectLabel ${LABEL_TW_CLASSES}`}>
					Select with overlapping label
				</label>
				<Select value={selectedFont} onValueChange={handleFontChange}>
					<SelectTrigger id={id}>
						<SelectValue placeholder='Select Font' />
					</SelectTrigger>
					<SelectContent>{fontOptions}</SelectContent>
				</Select>
			</div>
		</div>
	)
}

const fonts = {
	'--fontAtkinsonHyperlegible': 'Atkinson Hyperlegible',
	'--fontBeVietnamPro': 'Be Vietnam Pro',
	'--fontBricolageGrotesque': 'Bricolage Grotesque',
	'--fontCalSans': 'Cal Sans',
	'--fontEpilogue': 'Epilogue',
	'--fontFigtree': 'Figtree',
	'--fontFragmentMono': 'Fragment Mono',
	'--fontFunnelDisplay': 'Funnel Display',
	'--fontFunnelSans': 'Funnel Sans',
	'--fontGabarito': 'Gabarito',
	'--fontGeist': 'Geist',
	'--fontGeologica': 'Geologica',
	'--fontGolosText': 'Golos Text',
	'--fontHankenGrotesk': 'Hanken Grotesk',
	'--fontHostGrotesk': 'Host Grotesk',
	'--fontHubotSans': 'Hubot Sans',
	'--fontInstrumentSans': 'Instrument Sans',
	'--fontInterTight': 'Inter Tight',
	'--fontInter': 'Inter',
	'--fontLeagueSpartan': 'League Spartan',
	'--fontLexendDeca': 'Lexend Deca',
	'--fontLiter': 'Liter',
	'--fontPathwayExtreme': 'Pathway Extreme',
	'--fontPlusJakartaSans': 'Plus Jakarta Sans',
	'--fontPublicSans': 'Public Sans',
	'--fontQuestrial': 'Questrial',
	'--fontRethinkSans': 'Rethink Sans',
	'--fontSchibstedGrotesk': 'Schibsted Grotesk',
	'--fontSpaceGrotesk': 'Space Grotesk',
	'--fontTikTokSans': 'TikTok Sans',
	'--fontMonoAz': 'Azeret Mono',
	'--fontDisplayDM': 'DM Serif Display',
	'--fontSansHost': 'Host Grotesk',
	'--fontSansGeist': 'Geist',

	// Local fonts
	'--fontDenton': 'Denton',
	'--fontDentonCondensed': 'Denton Condensed',
	'--fontDentonText': 'Denton Text',
	'--fontLarken': 'Larken',
	'--fontPeregrin': 'Peregrin',
	'--fontSystemia': 'Systemia',
	'--fontSystemiaBeta': 'Systemia Beta',

	// // Sequential numeric aliases
	// '--font0': 'Atkinson Hyperlegible',
	// '--font1': 'Be Vietnam Pro',
	// '--font2': 'Bricolage Grotesque',
	// '--font3': 'Cal Sans',
	// '--font4': 'Epilogue',
	// '--font5': 'Figtree',
	// '--font6': 'Fragment Mono',
	// '--font7': 'Funnel Display',
	// '--font8': 'Funnel Sans',
	// '--font9': 'Gabarito',
	// '--font10': 'Geist',
	// '--font11': 'Geologica',
	// '--font12': 'Golos Text',
	// '--font13': 'Hanken Grotesk',
	// '--font14': 'Host Grotesk',
	// '--font15': 'Hubot Sans',
	// '--font16': 'Instrument Sans',
	// '--font17': 'Inter Tight',
	// '--font18': 'Inter',
	// '--font19': 'League Spartan',
	// '--font20': 'Lexend Deca',
	// '--font21': 'Liter',
	// '--font22': 'Pathway Extreme',
	// '--font23': 'Plus Jakarta Sans',
	// '--font24': 'Public Sans',
	// '--font25': 'Questrial',
	// '--font26': 'Rethink Sans',
	// '--font27': 'Schibsted Grotesk',
	// '--font28': 'Space Grotesk',
	// '--font29': 'TikTok Sans',
	// '--font30': 'Denton',
	// '--font31': 'Denton Condensed',
	// '--font32': 'Denton Text',
	// '--font33': 'Larken',
	// '--font34': 'Peregrin',
	// '--font35': 'Systemia',
	// '--font36': 'Systemia Beta',
}
