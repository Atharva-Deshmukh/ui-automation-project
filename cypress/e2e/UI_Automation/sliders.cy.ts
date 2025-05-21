/* Go to mentioned URLs FOR BETTER EXPERIENCE */

import { uiTimeout } from "../../fixtures/commonData";

describe('Handling slider inputs', () => {
    it('Range based sliders', () => {
        cy.visit('http://127.0.0.1:5500/DOMs/SLIDERS.html', {timeout: uiTimeout});
        // we need to change val and then trigger change event
        // val means we are invoking value()
        cy.get('#volume').invoke('val', 80).trigger('change'); 
        cy.get('p#response').should('include.text', 80);

        // since our step = 10, things are rounded up, if we set val = 72, it is rounded to 70,
        // if we set val = 78, it is rounded to 80
        cy.get('#volume').invoke('val', 72).trigger('change'); 
        cy.get('p#response').should('include.text', 70);
        cy.get('#volume').invoke('val', 76).trigger('change'); 
        cy.get('p#response').should('include.text', 80);
    });

    it('Image/carousal based sliders', () => {

        /*  Here, we don't have input range type sliders
        
           Approach for image based URLs, URLS change, so we can verify which image is in the slide
           Also, some DOM is hidden, we can click({force: true}) to change the slider
           Also, we can direclty use '<' '>' to change the slide
           Also, we can verify the URL in case it changes  */

        cy.visit('https://qaboxletstestcypresspracticesite.netlify.app/styledslider#slide-1', {timeout: uiTimeout});
        cy.get('.slider a[href="#slide-3"]').click(); 
        cy.get('.slides #slide-3').should('include.text', 3);
    });

    it('Material UI Slider', () => {
        /* DOM: This is a complex DOM

        <div class="MuiStack-root css-10sddac"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-q7mezt" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="VolumeDownIcon">
        <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02M5 9v6h4l5 5V4L9 9z"></path>
        </svg><span class="MuiSlider-root MuiSlider-colorPrimary MuiSlider-sizeMedium css-6nx9y3">
        <span class="MuiSlider-rail css-1m3hq23"></span>
        <span style="left: 0%; width: 45%;" class="MuiSlider-track css-1fw2xhf"></span>
        <span data-index="0" class="MuiSlider-thumb MuiSlider-thumbSizeMedium MuiSlider-thumbColorPrimary MuiSlider-thumb MuiSlider-thumbSizeMedium MuiSlider-thumbColorPrimary css-yq1go2" style="left: 45%;">
        <input data-index="0" aria-label="Volume" aria-valuenow="45" aria-orientation="horizontal" aria-valuemax="100" aria-valuemin="0" type="range" min="0" max="100" step="1" style="border:0;clip:rect(0 0 0 0);height:100%;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:100%;direction:ltr" value="45"></span></span><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-q7mezt" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="VolumeUpIcon"><path d="M3 9v6h4l5 5V4L7 9zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77"></path></svg></div>
        
        Inspect the element and CHANGE EVERY ATTRIBUTE THAT IS CHANGING.

        LOCATORS NEEDS TO BE OPTIMISED WITH XPATH */

        cy.visit('https://mui.com/material-ui/react-slider/', {timeout: uiTimeout});
        cy.get('.MuiSlider-track.css-1fw2xhf').invoke('attr', 'style', 'left: 0%; width: 100%;');
        cy.get('.MuiSlider-track.css-1fw2xhf ~ span[data-index="0"]').invoke('attr', 'style', 'left: 100%;');
        cy.get('input[aria-label="Volume"]').invoke('attr', 'aria-valuenow', '100');
        cy.get('input[aria-label="Volume"]').invoke('attr', 'value', '100');
    });

    it('Different slider', () => {

        /* DOM: here progress is denoted just by using styles, so invoke and change styles
        
        <div id="slider-range" class="ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content">
            <div class="ui-slider-range ui-corner-all ui-widget-header" style="left: 30.4%; width: 42.8%;"></div>
            <span tabindex="0" class="ui-slider-handle ui-corner-all ui-state-default" style="left: 30.4%;"></span>
            <span tabindex="0" class="ui-slider-handle ui-corner-all ui-state-default" style="left: 73.2%;"></span>
        </div>

        Use invoke('attr', 'style', 'left: 73.2%;')  // pick everything between "" for style value */

        cy.visit('https://testautomationpractice.blogspot.com/', {timeout: uiTimeout});
        cy.get('.ui-slider-range.ui-corner-all.ui-widget-header').invoke('attr', 'style', 'left: 14%; width: 84%;')
        .then(() => {
            cy.get('#slider-range span[tabindex="0"]:eq(0)').scrollIntoView().invoke('attr', 'style', 'left: 14%;'); 
            // corresponds to 490$
            cy.get('#slider-range span[tabindex="0"]:eq(1)').invoke('attr', 'style', 'left: 98%;'); 
            cy.get('input#amount').invoke('val').then((val) => {
                expect(val).to.include('$75 - $300')
            });
        }); 
    });

    it.only('Amazon Slider', () => {

        /* Inspect the slider and invoke the attribute that is changing */

        cy.visit('https://www.amazon.in/ref=nav_logo', {timeout: uiTimeout});
        cy.get('ul.a-unordered-list.a-nostyle.a-horizontal.feed-carousel-shelf')
        .invoke('attr', 'style', 'left: -2800px; margin-left: 0px;');
    });
});