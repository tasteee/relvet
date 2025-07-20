import './PianoDisplay.css'
import { observer } from 'mobx-react-lite'

export const PianoDisplay = observer(() => {
	return (
		<div className='PianoDisplay'>
			<div title='Piano keys' className='keysRow'>
				<div data-key='24' className='note wholeNote' style={{ left: '0%' }}></div>
				<div data-key='25' className='note halfNote' style={{ left: '1.944%' }}></div>
				<div data-key='26' className='note wholeNote' style={{ left: '2.778%' }}></div>
				<div data-key='27' className='note halfNote' style={{ left: '4.722%' }}></div>
				<div data-key='28' className='note wholeNote' style={{ left: '5.556%' }}></div>
				<div data-key='29' className='note wholeNote' style={{ left: '8.333%' }}></div>
				<div data-key='30' className='note halfNote' style={{ left: '10.278%' }}></div>
				<div data-key='31' className='note wholeNote hold-bass' style={{ left: '11.111%' }}></div>
				<div data-key='32' className='note halfNote' style={{ left: '13.056%' }}></div>
				<div data-key='33' className='note wholeNote' style={{ left: '13.889%' }}></div>
				<div data-key='34' className='note halfNote' style={{ left: '15.833%' }}></div>
				<div data-key='35' className='note wholeNote' style={{ left: '16.667%' }}></div>
				<div data-key='36' className='note wholeNote' style={{ left: '19.444%' }}></div>
				<div data-key='37' className='note halfNote' style={{ left: '21.389%' }}></div>
				<div data-key='38' className='note wholeNote' style={{ left: '22.222%' }}></div>
				<div data-key='39' className='note halfNote' style={{ left: '24.167%' }}></div>
				<div data-key='40' className='note wholeNote' style={{ left: '25%' }}></div>
				<div data-key='41' className='note wholeNote' style={{ left: '27.778%' }}></div>
				<div data-key='42' className='note halfNote' style={{ left: '29.722%' }}></div>
				<div data-key='43' className='note wholeNote' style={{ left: '30.556%' }}></div>
				<div data-key='44' className='note halfNote' style={{ left: '32.5%' }}></div>
				<div data-key='45' className='note wholeNote' style={{ left: '33.333%' }}></div>
				<div data-key='46' className='note halfNote' style={{ left: '35.278%' }}></div>
				<div data-key='47' className='note wholeNote' style={{ left: '36.111%' }}></div>
				<div data-key='48' className='note wholeNote' style={{ left: '38.889%' }}></div>
				<div data-key='49' className='note halfNote' style={{ left: '40.833%' }}></div>
				<div data-key='50' className='note wholeNote hold-chord' style={{ left: '41.667%' }}></div>
				<div data-key='51' className='note halfNote' style={{ left: '43.611%' }}></div>
				<div data-key='52' className='note wholeNote' style={{ left: '44.444%' }}></div>
				<div data-key='53' className='note wholeNote' style={{ left: '47.222%' }}></div>
				<div data-key='54' className='half hold-chord' style={{ left: '49.167%' }}></div>
				<div data-key='55' className='note wholeNote' style={{ left: '50%' }}></div>
				<div data-key='56' className='note halfNote' style={{ left: '51.944%' }}></div>
				<div data-key='57' className='note wholeNote' style={{ left: '52.778%' }}></div>
				<div data-key='58' className='note halfNote' style={{ left: '54.722%' }}></div>
				<div data-key='59' className='note wholeNote hold-chord' style={{ left: '55.556%' }}></div>
				<div data-key='60' className='note wholeNote' style={{ left: '58.333%' }}></div>
				<div data-key='61' className='note halfNote' style={{ left: '60.278%' }}></div>
				<div data-key='62' className='note wholeNote hold-chord' style={{ left: '61.111%' }}></div>
				<div data-key='63' className='note halfNote' style={{ left: '63.056%' }}></div>
				<div data-key='64' className='note wholeNote' style={{ left: '63.889%' }}></div>
				<div data-key='65' className='note wholeNote' style={{ left: '66.667%' }}></div>
				<div data-key='66' className='half hold-chord' style={{ left: '68.611%' }}></div>
				<div data-key='67' className='note wholeNote' style={{ left: '69.444%' }}></div>
				<div data-key='68' className='note halfNote' style={{ left: '71.389%' }}></div>
				<div data-key='69' className='note wholeNote' style={{ left: '72.222%' }}></div>
				<div data-key='70' className='note halfNote' style={{ left: '74.167%' }}></div>
				<div data-key='71' className='note wholeNote hold-chord' style={{ left: '75%' }}></div>
				<div data-key='72' className='note wholeNote' style={{ left: '77.778%' }}></div>
				<div data-key='73' className='note halfNote' style={{ left: '79.722%' }}></div>
				<div data-key='74' className='note wholeNote hold-chord' style={{ left: '80.556%' }}></div>
				<div data-key='75' className='note halfNote' style={{ left: '82.5%' }}></div>
				<div data-key='76' className='note wholeNote' style={{ left: '83.333%' }}></div>
				<div data-key='77' className='note wholeNote' style={{ left: '86.111%' }}></div>
				<div data-key='78' className='half hold-chord' style={{ left: '88.056%' }}></div>
				<div data-key='79' className='note wholeNote' style={{ left: '88.889%' }}></div>
				<div data-key='80' className='note halfNote' style={{ left: '90.833%' }}></div>
				<div data-key='81' className='note wholeNote' style={{ left: '91.667%' }}></div>
				<div data-key='82' className='note halfNote' style={{ left: '93.611%' }}></div>
				<div data-key='83' className='note wholeNote hold-chord' style={{ left: '94.444%' }}></div>
				<div data-key='84' className='note wholeNote' style={{ left: '97.222%' }}></div>
			</div>
		</div>
	)
})
