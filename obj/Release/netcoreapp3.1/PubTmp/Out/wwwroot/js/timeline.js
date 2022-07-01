new Vue({
    el: "#main",
    data: {
        panels: panels(),
        current_index: -1,
        time_height: 0,
        time_position: {
            top: 0
        },
        transition: "in",
        current_month: [0, 0, 0],
        current_date: [0, 0],
        numbers: "0123456789".split(""),
        letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
        display_day: "00",
        display_month: "JAN"
    },
    methods: {
        handleScroll: function(e) {
            let delta = e.deltaY;

            if (delta < 0 && this.current_index >= 0) {
                this.transition = "out";
                this.current_index--;
            }

            if (delta > 0 && this.current_index < (this.panels.length - 1)) {
                this.current_index++;
                this.transition = "in";
            }

        },
        getLineClass: function(index) {
            return {
                active: this.current_index == index,
                "pre-1": this.current_index - 1 == index,
                "post-1": this.current_index + 1 == index,
                "pre-2": this.current_index - 2 == index,
                "post-2": this.current_index + 2 == index,
                "pre-3": this.current_index - 3 == index,
                "post-3": this.current_index + 3 == index
            }
        },
        onUpdateDays: function() {
            let days = [];

            for (var i = 0; i < this.current_date.length; i++) {
                const rand = this.numbers[Math.round(this.current_date[i]) % this.numbersLength];
                days.push(rand);
            }
            this.display_day = days.join("");
        },
        onUpdateMonth: function() {
            let month = [];

            for (var i = 0; i < this.current_month.length; i++) {
                const rand = this.letters[Math.round(this.current_month[i]) % this.lettersLength];
                month.push(rand);
            }
            this.display_month = month.join("");
        }
    },
    beforeMount: function() {
        var images = [];
        this.panels.forEach((p, i) => {
            if (p.hasOwnProperty("src")) {
                images[i] = new Image();
                images[i].srcset = p.src;
            }
        })
    },
    mounted: function() {
        const timeEl = this.$refs.time;
        this.time_height = timeEl.getBoundingClientRect().height;

    },
    computed: {
        endDate: function() {
            const date = this.panels[this.panels.length - 1];
            return `${date.date} 2020`;
        },
        getPosition: function() {
            let top = this.current_panel * -100;
            return {
                transform: `translateY(${top}vh)`
            }
        },
        currentPanel: function() {
            if (this.current_index < 0)
                return {};

            return this.panels[this.current_index];
        },
        numbersLength: function() {
            return this.numbers.length;
        },
        lettersLength: function() {
            return this.letters.length;
        },
        wrapperStyle: function() {
            const top = (this.current_index == -1) ? 0 : "-100%";
            return {
                transform: `translateY(${top})`
            }
        }
    },
    watch: {
        current_index: {
            handler: function(newVal) {
                this.$nextTick(function() {
                    const currentLine = this.$el.querySelector(`.line:nth-child(${newVal + 1})`);

                    if (currentLine == null)
                        return {}

                    const dim = currentLine.offsetTop;
                    const top = dim - this.time_height - (this.time_height / 2);

                    this.time_position = {
                        top: `${top}px`
                    }

                    let newDay = this.panels[this.current_index];
                    this.current_date = [0, 0];
                    this.current_month = [0, 0, 0];
                    const splitDate = newDay.date.split(" ");
                    const days = splitDate[0].split("");

                    let month = splitDate[1].split("");
                    month = month.map(m => this.letters.indexOf(m.toUpperCase()));

                    gsap.to(this.$data.current_date, {
                        duration: 0.3,
                        ease: Linear.easeNone,
                        "0": this.numbersLength * 20 + days[0],
                        "1": this.numbersLength * 60 + days[1],
                        onUpdate: this.onUpdateDays
                    });


                    gsap.to(this.$data.current_month, {
                        duration: 0.3,
                        ease: Linear.easeNone,
                        "0": this.lettersLength * 20 + month[0],
                        "1": this.lettersLength * 20 + month[1],
                        "2": this.lettersLength * 20 + month[2],
                        onUpdate: this.onUpdateMonth
                    });
                });
            },
        }
    }
});

function panels() {
    return [{
            "date": "31 Dec",
            "title": "Chinese authorities treated dozens of cases of pneumonia of unknown cause.",
            "desc": "<p>On Dec. 31, the<a class=\"\" href=\"https://www.nytimes.com/2020/01/06/world/asia/china-SARS-pneumonialike.html\" title=\"\" target=\"blank\"> government in Wuhan, China, confirmed</a> that health authorities were treating dozens of cases. Days later, researchers in China <a class=\"\" href=\"https://www.nytimes.com/2020/01/08/health/china-pneumonia-outbreak-virus.html\" title=\"\" target=\"blank\">identified a new virus</a> that had infected dozens of people in Asia. At the time, there was no evidence that the virus was readily spread by humans. Health officials in China said they were monitoring it to prevent the outbreak from developing into something more severe.</p>"
        },
        {
            "date": "11 Jan",
            "title": "China reported its first death.",
            "desc": "<p>On Jan. 11, Chinese state media reported the <a class=\"\" href=\"https://www.nytimes.com/2020/01/10/world/asia/china-virus-wuhan-death.html\" title=\"\" target=\"blank\">first known death</a> from an illness caused by the virus, which had infected dozens of people. The 61-year-old man who died was a regular customer at the market in Wuhan. The report of his death came just before one of China’s biggest holidays, when hundreds of millions of people travel across the country.</p>"
        },
        {
            "date": "20 Jan",
            "title": "Other countries, including the United States, confirmed cases.",
            "desc": "<p>The first confirmed cases outside mainland China occurred in Japan, South Korea and Thailand, according to the W.H.O.’s first <a class=\"\" href=\"https://www.who.int/docs/default-source/coronaviruse/situation-reports/20200121-sitrep-1-2019-ncov.pdf?sfvrsn=20a99c10_4\" title=\"\" rel=\"noopener noreferrer\" target=\"blank\">situation report</a>. The first confirmed case in the United States came the next day in Washington State, where <a class=\"\" href=\"https://www.nytimes.com/2020/01/21/health/cdc-coronavirus.html\" title=\"\" target=\"blank\">a man in his 30s developed symptoms</a> after returning from a trip to Wuhan.</p>"
        },
        {
            "date": "23 Jan",
            "title": "Wuhan, a city of more than 11 million, was cut off by the Chinese authorities.",
            "src": "https://static01.nyt.com/images/2020/02/11/multimedia/00xp-virustimeline4/merlin_168335142_4eca1f21-e21b-4b97-8b87-dad2489ee05b-articleLarge.jpg?quality=90&auto=webp 600w,https://static01.nyt.com/images/2020/02/11/multimedia/00xp-virustimeline4/merlin_168335142_4eca1f21-e21b-4b97-8b87-dad2489ee05b-jumbo.jpg?quality=90&auto=webp 1024w,https://static01.nyt.com/images/2020/02/11/multimedia/00xp-virustimeline4/merlin_168335142_4eca1f21-e21b-4b97-8b87-dad2489ee05b-superJumbo.jpg?quality=90&auto=webp 2048w",
            "desc": "<p>The Chinese authorities<a class=\"\" href=\"https://www.nytimes.com/2020/01/22/world/asia/china-coronavirus-travel.html\" title=\"\" target=\"blank\"> closed off Wuhan</a> by canceling planes and trains leaving the city, and suspending buses, subways and ferries within it. At this point, at least 17 people had died and more than 570 others had been infected, including in Taiwan, Japan, Thailand, South Korea and the United States.</p>"
        },
        {
            "date": "30 Jan",
            "title": "The W.H.O. declared a global health emergency.",
            "desc": "<p>Amid thousands of new cases in China, a “public health emergency of international concern” was officially <a class=\"\" href=\"https://www.nytimes.com/2020/01/30/health/coronavirus-world-health-organization.html\" title=\"\" target=\"blank\">declared </a>by the W.H.O. China’s Foreign Ministry spokeswoman said that it would continue to work with the W.H.O. and other countries to protect public health, and the U.S. <a class=\"\" href=\"https://www.nytimes.com/2020/01/30/world/asia/Coronavirus-travel-advisory-.html\" title=\"\" target=\"blank\">State Department warned</a> travelers to avoid China.</p>"
        },
        {
            "date": "31 Jan",
            "title": "The Trump administration restricted travel from China",
            "desc": "<p>The Trump administration <a class=\"\" href=\"https://www.nytimes.com/2020/01/31/business/china-travel-coronavirus.html\" title=\"\" target=\"blank\">suspended entry</a> into the United States by any foreign nationals who had traveled to China in the past 14 days, excluding the immediate family members of American citizens or permanent residents. By this date, <a class=\"\" href=\"https://www.nytimes.com/2020/01/30/world/asia/coronavirus-china.html#link-6a63a9b7\" title=\"\" target=\"blank\">213 people had died</a> and nearly 9,800 had been infected worldwide.</p>"
        },
        {
            "date": "02 Feb",
            "title": "The first coronavirus death was reported outside China.",
            "desc": "<p>A 44-year-old man in the Philippines <a class=\"\" href=\"https://www.nytimes.com/2020/02/02/world/asia/philippines-coronavirus-china.html\" title=\"\" target=\"blank\">died after being infected</a>, officials said, the first death reported outside China. By this point, more than 360 people had died.</p>"
        },
        {
            "date": "05 Feb",
            "title": "A cruise ship in Japan quarantined thousands.",
            "src": "https://static01.nyt.com/images/2020/03/22/multimedia/00xp-virustimeline6/merlin_168707022_c59b8a80-0fa2-43ab-b50c-8366f8c6f2b6-articleLarge.jpg?quality=90&auto=webp 600w,https://static01.nyt.com/images/2020/03/22/multimedia/00xp-virustimeline6/merlin_168707022_c59b8a80-0fa2-43ab-b50c-8366f8c6f2b6-jumbo.jpg?quality=90&auto=webp 1024w,https://static01.nyt.com/images/2020/03/22/multimedia/00xp-virustimeline6/merlin_168707022_c59b8a80-0fa2-43ab-b50c-8366f8c6f2b6-superJumbo.jpg?quality=90&auto=webp 2048w",
            "desc": "<p>After a two-week trip to Southeast Asia, more than 3,600 passengers began a<a class=\"\" href=\"https://www.nytimes.com/2020/02/05/world/asia/japan-coronavirus-cruise-ship.html\" title=\"\" target=\"blank\"> quarantine</a> aboard the Diamond Princess cruise ship in Yokohama, Japan. Officials started screening passengers, and the number of people who tested positive became the largest number of coronavirus cases outside China. By Feb. 13, the number <a class=\"\" href=\"https://www.nytimes.com/2020/02/12/travel/coronavirus-cruises-travel.html\" title=\"\" target=\"blank\">stood at 218</a>. When they began leaving the ship on Feb. 19, more than 600 people had been infected.</p>"
        },
        {
            "date": "07 Feb",
            "title": "A Chinese doctor who tried to raise the alarm died.",
            "src": "https://static01.nyt.com/images/2020/02/12/multimedia/00xp-virustimeline5/merlin_168524808_e05e8362-bed5-446e-87ad-d3f03a5cd726-articleLarge.jpg?quality=90&auto=webp 600w,https://static01.nyt.com/images/2020/02/12/multimedia/00xp-virustimeline5/merlin_168524808_e05e8362-bed5-446e-87ad-d3f03a5cd726-jumbo.jpg?quality=90&auto=webp 1024w,https://static01.nyt.com/images/2020/02/12/multimedia/00xp-virustimeline5/merlin_168524808_e05e8362-bed5-446e-87ad-d3f03a5cd726-superJumbo.jpg?quality=90&auto=webp 2048w",
            "desc": "<p>When <a class=\"\" href=\"https://www.nytimes.com/2020/02/06/world/asia/chinese-doctor-Li-Wenliang-coronavirus.html\" title=\"\" target=\"blank\">Dr. Li Wenliang</a>, a Chinese doctor, <a class=\"\" href=\"https://www.nytimes.com/2020/02/06/world/asia/chinese-doctor-Li-Wenliang-coronavirus.html\" title=\"\" target=\"blank\">died </a>after contracting the coronavirus, he was hailed as a hero by many for trying to ring early alarms that infections could spin out of control.</p><p>In early January, the authorities reprimanded him, and he was forced to sign a statement denouncing his warning Dr. Li’s death <a class=\"\" href=\"https://www.nytimes.com/2020/02/07/business/china-coronavirus-doctor-death.html\" title=\"\" target=\"blank\">provoked anger and frustration</a> at how the Chinese government mishandled the situation.</p>"
        },
        {
            "date": "11 Feb",
            "title": "The disease the virus causes was named.",
            "desc": "<p>The W.H.O. proposed an official name for the disease the virus coronavirus causes: <a class=\"\" href=\"https://www.nytimes.com/2020/02/11/world/asia/coronavirus-china.html?action=click&amp;module=Top%20Stories&amp;pgtype=Homepage\" title=\"\" target=\"blank\">Covid-19</a>, an acronym that stands for coronavirus disease 2019. The name makes no reference to any of the people, places, or animals associated with the coronavirus, given the goal to avoid stigma.</p>"
        },
        {
            "date": "14 Feb",
            "title": "France announced the first coronavirus death in Europe.",
            "src": "https://static01.nyt.com/images/2020/03/31/world/31xp-virustimeline1/31xp-virustimeline1-articleLarge-v2.jpg?quality=90&auto=webp 600w,https://static01.nyt.com/images/2020/03/31/world/31xp-virustimeline1/31xp-virustimeline1-jumbo-v2.jpg?quality=90&auto=webp 1024w,https://static01.nyt.com/images/2020/03/31/world/31xp-virustimeline1/31xp-virustimeline1-superJumbo-v2.jpg?quality=90&auto=webp 2048w",
            "desc": "<p>An 80-year-old Chinese tourist <a class=\"\" href=\"https://www.nytimes.com/2020/02/15/world/asia/coronavirus-china-live-updates.html?action=click&amp;module=Top%20Stories&amp;pgtype=Homepage#link-313a84de\" title=\"\" target=\"blank\">died on Feb. 14</a> at a hospital in Paris, in what was the first coronavirus death outside Asia, the authorities said. It was the fourth death from the virus outside mainland China, where about 1,500 people had died, most of them in Hubei Province.</p>"
        },
        {
            "date": "23 Feb",
            "title": "Italy saw a major surge in cases.",
            "src": "https://static01.nyt.com/images/2020/03/31/world/31xpvirustimeline4/31xpvirustimeline4-articleLarge-v2.jpg?quality=90&auto=webp 600w,https://static01.nyt.com/images/2020/03/31/world/31xpvirustimeline4/31xpvirustimeline4-jumbo-v2.jpg?quality=90&auto=webp 1024w,https://static01.nyt.com/images/2020/03/31/world/31xpvirustimeline4/31xpvirustimeline4-superJumbo-v2.jpg?quality=90&auto=webp 2048w",
            "desc": "<p>Europe faced its <a class=\"\" href=\"https://www.nytimes.com/2020/02/23/world/europe/italy-coronavirus.html\" title=\"\" target=\"blank\">first major outbreak</a> as the number of reported cases in Italy grew from fewer than five to more than 150. In the Lombardy region, officials locked down 10 towns after a cluster of cases suddenly emerged in Codogno, southeast of Milan. Schools closed and sporting and cultural events were canceled.</p>"
        },
        {
            "date": "24 Feb",
            "title": "Iran emerged as a second focus point.",
            "src": "https://static01.nyt.com/images/2020/02/24/business/00xp-virustimeline11/24china-briefing13-articleLarge.jpg?quality=90&auto=webp 600w,https://static01.nyt.com/images/2020/02/24/business/00xp-virustimeline11/24china-briefing13-jumbo.jpg?quality=90&auto=webp 1024w,https://static01.nyt.com/images/2020/02/24/business/00xp-virustimeline11/24china-briefing13-superJumbo.jpg?quality=90&auto=webp 2048w",
            "desc": "<p>Iran announced its first two coronavirus cases on Feb. 19. Less than a week later, the country said it had <a class=\"\" href=\"https://www.nytimes.com/2020/02/24/world/asia/china-coronavirus.html#link-755cef26\" title=\"\" target=\"blank\">61 coronavirus cases</a> and 12 deaths, more than any other country at the time but China, and public health experts warned that Iran was a cause for worry — its borders are crossed each year by millions of religious pilgrims, migrant workers and others. Cases in Iraq, Afghanistan, Bahrain, Kuwait, Oman, Lebanon, the United Arab Emirates and one in Canada, have been traced back to Iran.</p>"
        },
        {
            "date": "26 Feb",
            "title": "Latin America reported its first case.",
            "desc": "<p>Brazilian <a class=\"\" href=\"https://www.nytimes.com/2020/02/26/world/americas/brazil-italy-coronavirus.html\" title=\"\" target=\"blank\">health officials</a> said that a 61-year-old São Paulo man, who had returned recently from a business trip to Italy, tested positive for the coronavirus. It was the first known case in Latin America. Officials also began tracking down other passengers on the flight the man took to Brazil and others who had contact with him in recent days.</p>"
        },
        {
            "date": "01 Mar",
            "title": "The United States reported a death.",
            "desc": "<p>On Feb. 29, the authorities announced that a patient near Seattle had died from the coronavirus, in what was believed to be the <a class=\"\" href=\"https://www.nytimes.com/2020/02/29/us/coronavirus-washington-death.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article\" title=\"\" target=\"blank\">first coronavirus death</a> in the United States at the time. In fact, two people had died earlier, though their Covid-19 diagnoses were not discovered until months later.</p><p>As the number of global cases rose to nearly 87,000, the Trump administration <a class=\"\" href=\"https://www.nytimes.com/2020/02/29/world/coronavirus-news.html#link-63f783d3\" title=\"\" target=\"blank\">issued its highest-level warning</a>, known as a “do not travel” warning, for areas in Italy and South Korea most affected by the virus.</p>"
        },
        {
            "date": "03 Mar",
            "title": "U.S. officials approved widespread testing.",
            "desc": "<p>The C.D.C. <a class=\"\" href=\"https://www.nytimes.com/2020/03/03/world/coronavirus-live-news-updates.html#link-79b1dbc8\" title=\"\" target=\"blank\">lifted all federal restrictions</a> on testing for the coronavirus on March 3, according to Vice President Mike Pence. The news came after the C.D.C.’s first attempt to produce a diagnostic test kit <a class=\"\" href=\"https://www.nytimes.com/2020/03/02/world/coronavirus-updates-news-covid-19.html\" title=\"\" target=\"blank\">fell flat</a>. By this point, the coronavirus had infected more than 90,000 around the globe and killed about 3,000, <a class=\"\" href=\"https://www.who.int/docs/default-source/coronaviruse/situation-reports/20200303-sitrep-43-covid-19.pdf?sfvrsn=2c21c09c_2\" title=\"\" rel=\"noopener noreferrer\" target=\"blank\">according to the W.H.O.</a></p>"
        },
        {
            "date": "13 Mar",
            "title": "President Trump declared a national emergency.",
            "src": "https://static01.nyt.com/images/2020/03/31/us/31xpvirustimeline2/31xpvirustimeline2-articleLarge-v2.jpg?quality=90&auto=webp 600w,https://static01.nyt.com/images/2020/03/31/us/31xpvirustimeline2/31xpvirustimeline2-jumbo-v2.jpg?quality=90&auto=webp 1024w,https://static01.nyt.com/images/2020/03/31/us/31xpvirustimeline2/31xpvirustimeline2-superJumbo-v2.jpg?quality=90&auto=webp 2048w",
            "desc": "<p>Mr. Trump officially<a class=\"\" href=\"https://www.nytimes.com/2020/03/13/world/coronavirus-news-live-updates.html#link-37509802\" title=\"\" target=\"blank\"> declared a national emergency</a>, and said he was making $50 billion in federal funds available to states and territories to combat the coronavirus. He also said he would give hospitals and doctors more flexibility to respond to the virus, including making it easier to treat people remotely.</p>"
        },
        {
            "date": "15 Mar",
            "title": "The C.D.C. recommended no gatherings of 50 or more people in the U.S.",
            "src": "https://static01.nyt.com/images/2020/04/13/us/politics/13xp-timeline-5/merlin_170701089_4f652274-b6d3-4b0e-9c96-0b016a11ec87-articleLarge.jpg?quality=90&auto=webp 600w,https://static01.nyt.com/images/2020/04/13/us/politics/13xp-timeline-5/merlin_170701089_4f652274-b6d3-4b0e-9c96-0b016a11ec87-jumbo.jpg?quality=90&auto=webp 1024w,https://static01.nyt.com/images/2020/04/13/us/politics/13xp-timeline-5/merlin_170701089_4f652274-b6d3-4b0e-9c96-0b016a11ec87-superJumbo.jpg?quality=90&auto=webp 2048w",
            "desc": "<p>The C.D.C. <a class=\"\" href=\"https://www.nytimes.com/2020/03/15/world/coronavirus-live.html\" title=\"\" target=\"blank\">advised no gatherings</a> of 50 or more people in the United States over the next eight weeks. The recommendation included weddings, festivals, parades, concerts, sporting events and conferences. The following day, Mr. Trump advised citizens to <a class=\"\" href=\"https://www.nytimes.com/2020/03/16/world/live-coronavirus-news-updates.html\" title=\"\" target=\"blank\">avoid groups</a> of more than 10. New York City’s public schools system, the nation’s largest with 1.1 million students, <a class=\"\" href=\"https://www.nytimes.com/2020/03/15/nyregion/nyc-schools-closed.html\" title=\"\" target=\"blank\">announced that it would close</a>.</p>"
        },
        {
            "date": "16 Mar",
            "title": "Latin America began to feel the effects.",
            "desc": "<p>Several countries across Latin America <a class=\"\" href=\"https://www.nytimes.com/2020/03/16/world/live-coronavirus-news-updates.html\" title=\"\" target=\"blank\">imposed restrictions</a> on their citizens to slow the spread of the virus. Venezuela announced a nationwide quarantine that began on March 17. Ecuador and Peru implemented countrywide lockdowns, while Colombia and Costa Rica closed their borders. However, Jair Bolsonaro, the president of Brazil, encouraged mass demonstrations by his supporters against his opponents in congress.</p>"
        },
        {
            "date": "17 Mar",
            "title": "The E.U. barred most travelers from outside the bloc.",
            "src": "https://static01.nyt.com/images/2020/04/13/us/politics/13xp-virus-timeline-7/merlin_170722023_f98890be-c166-4ce2-8d3b-c30f2ecf9a2f-articleLarge.jpg?quality=90&auto=webp 600w,https://static01.nyt.com/images/2020/04/13/us/politics/13xp-virus-timeline-7/merlin_170722023_f98890be-c166-4ce2-8d3b-c30f2ecf9a2f-jumbo.jpg?quality=90&auto=webp 1024w,https://static01.nyt.com/images/2020/04/13/us/politics/13xp-virus-timeline-7/merlin_170722023_f98890be-c166-4ce2-8d3b-c30f2ecf9a2f-superJumbo.jpg?quality=90&auto=webp 2048w",
            "desc": "<p>European leaders <a class=\"\" href=\"https://www.nytimes.com/2020/03/17/world/europe/EU-closes-borders-virus.html\" title=\"\" target=\"blank\">voted to close off at least 26 countries</a> to nearly all visitors from the rest of the world for at least 30 days. The ban on nonessential travel from outside the bloc was the first coordinated response to the epidemic by the European Union.</p>"
        },
        {
            "date": "19 Mar",
            "title": "For the first time, China reported zero local infections.",
            "desc": "<p>China reported <a class=\"\" href=\"https://www.nytimes.com/2020/03/18/world/asia/china-coronavirus-zero-infections.html\" title=\"\" target=\"blank\">no new local infections</a> for the previous day, a milestone in the ongoing fight against the pandemic. The news signaled that an end to China’s epidemic could be in sight.</p><p>However, experts said the country would need to see at least 14 consecutive days without new infections for the outbreak to be considered over. And the announcement did not mean that China recorded no new coronavirus cases. Officials said that 34 new cases had been confirmed among people who had arrived in China from elsewhere.</p>"
        },
        {
            "date": "24 Mar",
            "title": "The Tokyo Olympics were delayed until 2021.",
            "desc": "<p>Officials announced that the <a class=\"\" href=\"https://www.nytimes.com/2020/03/24/sports/olympics/coronavirus-summer-olympics-postponed.html\" title=\"\" target=\"blank\">Summer Olympics in Tokyo would be postponed</a> for one year.<span class=\"css-8l6xbc evw5hdy0\"> </span>Only three previous Games had been canceled, all because of war: in 1916, 1940 and 1944.</p>"
        },
        {
            "date": "24 Mar",
            "title": "India announced a 21-day lockdown.",
            "src": "https://static01.nyt.com/images/2020/03/31/world/31xpvirustimeline6/31xpvirustimeline6-articleLarge-v2.jpg?quality=90&auto=webp 600w,https://static01.nyt.com/images/2020/03/31/world/31xpvirustimeline6/31xpvirustimeline6-jumbo-v2.jpg?quality=90&auto=webp 1024w,https://static01.nyt.com/images/2020/03/31/world/31xpvirustimeline6/31xpvirustimeline6-superJumbo-v2.jpg?quality=90&auto=webp 2048w",
            "desc": "<p>One day after the authorities halted all domestic flights, Narendra Modi, India’s prime minister, <a class=\"\" href=\"https://www.nytimes.com/2020/03/24/world/asia/india-coronavirus-lockdown.html\" title=\"\" target=\"blank\">declared a 21-day lockdown</a>. While the number of reported cases in India was about 500, the prime minister pledged to spend about $2 billion on medical supplies, isolation rooms, ventilators and training for medical professionals.</p>"
        },
        {
            "date": "26 Mar",
            "title": "The United States led the world in confirmed cases.",
            "desc": "<p>The United States officially became the country <a class=\"\" href=\"https://www.nytimes.com/2020/03/26/health/usa-coronavirus-cases.html\" title=\"\" target=\"blank\">hardest hit by the pandemic</a>, with at least 81,321 confirmed infections and more than 1,000 deaths. This was more reported cases than in China, Italy or any other country at the time.</p>"
        },
        {
            "date": "27 Mar",
            "title": "Trump signed a stimulus bill into law.",
            "desc": "<p>Mr. Trump <a class=\"\" href=\"https://www.nytimes.com/2020/03/27/us/politics/coronavirus-house-voting.html\" title=\"\" target=\"blank\">signed a $2 trillion measure</a> to respond to the coronavirus pandemic. Lawmakers said the bill, which passed with overwhelming support, was imperfect but essential to address the national public health and economic crisis.</p>"
        },
        {
            "date": "30 Mar",
            "title": "More states issued stay-at-home directives.",
            "desc": "<p>Virginia, Maryland and Washington, D.C., <a class=\"\" href=\"https://www.nytimes.com/interactive/2020/us/coronavirus-stay-at-home-order.html\" title=\"\" target=\"blank\">issued orders</a> requiring their residents to stay home. Similar orders went into effect for Kansas and North Carolina. Other states had previously put strict measures in place. The new orders meant that least 265 million Americans were being urged to stay home.</p>"
        },
        {
            "date": "02 Apr",
            "title": "Cases topped a million, and millions lost their jobs.",
            "desc": "<p>By April 2, the pandemic had sickened more than one million people in 171 countries across six continents, killing at least 51,000.</p><p>In just a few weeks, the pandemic put nearly <a class=\"\" href=\"https://www.nytimes.com/2020/04/02/business/economy/coronavirus-unemployment-claims.html\" title=\"\" target=\"blank\">10 million Americans out of work</a>, including a staggering 6.6 million people who applied for unemployment benefits in the last week of March. The speed and scale of the job losses was without precedent: Until March, the worst week for unemployment filings was 695,000 in 1982.</p>"
        },
        {
            "date": "06 Apr",
            "title": "Prime Minister Boris Johnson moved into intensive care.",
            "desc": "<p>Ten days <a class=\"\" href=\"https://twitter.com/BorisJohnson/status/1243496858095411200\" title=\"\" rel=\"noopener noreferrer\" target=\"blank\">after going public</a> with his coronavirus diagnosis, Prime Minister Boris Johnson of Britain was <a class=\"\" href=\"https://www.nytimes.com/2020/04/06/world/europe/boris-johnson-coronavirus-hospital-intensive-care.html\" title=\"\" target=\"blank\">moved into intensive care</a>. The decision was a precaution, according to the British government, who also said he had been in good spirits. Mr. Johnson had also asked the foreign secretary, Dominic Raab, to deputize for him “where necessary.” He was released on April 12.</p>"
        },
        {
            "date": "10 Apr",
            "title": "Cases surged in Russia.",
            "src": "https://static01.nyt.com/images/2020/04/10/world/10virus-moscow-copy/merlin_171261144_da859ea1-d1e2-4f58-998e-ad284405c998-articleLarge.jpg?quality=90&auto=webp 600w,https://static01.nyt.com/images/2020/04/10/world/10virus-moscow-copy/merlin_171261144_da859ea1-d1e2-4f58-998e-ad284405c998-jumbo.jpg?quality=90&auto=webp 1024w,https://static01.nyt.com/images/2020/04/10/world/10virus-moscow-copy/merlin_171261144_da859ea1-d1e2-4f58-998e-ad284405c998-superJumbo.jpg?quality=90&auto=webp 2048w",
            "desc": "<p>The number of people hospitalized in Moscow with Covid-19 <a class=\"\" href=\"https://www.nytimes.com/2020/04/10/world/europe/coronavirus-russia-moscow-putin.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article\" title=\"\" target=\"blank\">doubled from the previous week</a>, with two-thirds of the country’s 12,000 reported cases in Moscow. The increase in cases pushed Moscow’s health care system to its limit, well before an expected peak.</p>"
        },
        {
            "date": "14 Apr",
            "title": "The global economy slid toward contraction.",
            "desc": "<p>The International Monetary Fund warned that the global economy was <a class=\"\" href=\"https://www.nytimes.com/2020/04/14/us/politics/coronavirus-economy-recession-depression.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article\" title=\"\" target=\"blank\">headed for its worst downturn</a> since the Great Depression. The organization predicted the world economy would contract by 3 percent in 2020, a reversal from its forecast early this year that the world economy would grow by 3.3 percent.</p>"
        },
        {
            "date": "17 Apr",
            "title": "President Trump encouraged protests against some state restrictions.",
            "desc": "<p>In a series of all-cap tweets, Mr. Trump <a class=\"\" href=\"https://www.nytimes.com/2020/04/17/us/politics/trump-coronavirus-governors.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article\" title=\"\" target=\"blank\">encouraged</a> right-wing protests of social distancing restrictions in some states. His call followed protests in Michigan, Minnesota and Ohio where protesters — many wearing red “Make America Great Again” hats — congregated in packed groups around state capitols to demand that restrictions be lifted and to demonize their governors.</p>"
        },
        {
            "date": "21 Apr",
            "title": "Officials discovered earlier known U.S. coronavirus deaths in California.",
            "desc": "<p>Officials in Santa Clara County, Calif., announced that two residents there died of the coronavirus on Feb. 6 and Feb. 17, making them <a class=\"\" href=\"https://www.nytimes.com/2020/04/22/us/coronavirus-first-united-states-death.html\" title=\"\" target=\"blank\">the earliest known</a><a class=\"\" href=\"https://www.nytimes.com/2020/02/29/us/coronavirus-washington-death.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article\" title=\"\" target=\"blank\"> victims</a> of the pandemic in the United States. The new information, gained from autopsies of the residents, moved the timeline of the virus’s spread in country weeks earlier than previously understood. .</p>"
        },
        {
            "date": "24 Apr",
            "title": "The European Union, pressured by China, watered down a report on disinformation.",
            "desc": "<p>The E.U. appeared to succumb to pressure from Beijing and softened criticism of China <a class=\"\" href=\"https://www.nytimes.com/2020/04/24/world/europe/disinformation-china-eu-coronavirus.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article\" title=\"\" target=\"blank\">in a report on disinformation </a>about the coronavirus pandemic. While the initial report was not particularly harsh, European officials delayed and then rewrote the document to dilute the focus on China, a vital trading partner.</p>"
        },
        {
            "date": "26 Apr",
            "title": "The global death toll surpassed 200,000.",
            "src": "https://static01.nyt.com/images/2020/06/13/us/13xp-virustimeline-death/merlin_171993099_5540e16f-b69f-4b3d-bc92-71bb5fff4de7-articleLarge.jpg?quality=90&auto=webp 600w,https://static01.nyt.com/images/2020/06/13/us/13xp-virustimeline-death/merlin_171993099_5540e16f-b69f-4b3d-bc92-71bb5fff4de7-jumbo.jpg?quality=90&auto=webp 1024w,https://static01.nyt.com/images/2020/06/13/us/13xp-virustimeline-death/merlin_171993099_5540e16f-b69f-4b3d-bc92-71bb5fff4de7-superJumbo.jpg?quality=90&auto=webp 2048w",
            "desc": "<p>By April 26, the coronavirus pandemic had killed more than 200,000 people and sickened more than 2.8 million worldwide, according to data <a class=\"\" href=\"https://www.nytimes.com/interactive/2020/world/coronavirus-maps.html\" title=\"\" target=\"blank\">collected by The New York Times</a>. The actual toll is higher by an unknown degree, and will remain so for some time.</p>"
        },
        {
            "date": "30 Apr",
            "title": "Airlines announced rules requiring face masks.",
            "src": "https://static01.nyt.com/images/2020/06/13/multimedia/13xp-virustimeline-mask/merlin_172209270_51e33667-edaa-4e73-8ba7-8677dce93320-articleLarge.jpg?quality=90&auto=webp 600w,https://static01.nyt.com/images/2020/06/13/multimedia/13xp-virustimeline-mask/merlin_172209270_51e33667-edaa-4e73-8ba7-8677dce93320-jumbo.jpg?quality=90&auto=webp 1024w,https://static01.nyt.com/images/2020/06/13/multimedia/13xp-virustimeline-mask/merlin_172209270_51e33667-edaa-4e73-8ba7-8677dce93320-superJumbo.jpg?quality=90&auto=webp 2048w",
            "desc": "<p>American Airlines and Delta Air Lines said they would require all passengers and flight attendants <a class=\"\" href=\"https://www.nytimes.com/2020/04/30/business/airlines-masks-coronavirus-passengers.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article\" title=\"\" target=\"blank\">to wear a face covering</a>. Lufthansa Group — which owns Lufthansa, Swiss International Air Lines and Austrian Airlines — as well as JetBlue and Frontier Airlines had made similar announcements.</p>"
        },
        {
            "date": "05 May",
            "title": "The coronavirus reached France in December, doctors said, rewriting the epidemic’s timeline.",
            "src": "https://static01.nyt.com/images/2020/06/13/multimedia/13xp-virustimeline-france/13xp-virustimeline-france-articleLarge.jpg?quality=90&auto=webp 600w,https://static01.nyt.com/images/2020/06/13/multimedia/13xp-virustimeline-france/13xp-virustimeline-france-jumbo.jpg?quality=90&auto=webp 1024w,https://static01.nyt.com/images/2020/06/13/multimedia/13xp-virustimeline-france/13xp-virustimeline-france-superJumbo.jpg?quality=90&auto=webp 2048w",
            "desc": "<p>French doctors said that they had discovered that a patient treated for pneumonia in late December had the coronavirus. If the diagnosis is verified, it would suggest that the virus <a class=\"\" href=\"https://www.nytimes.com/2020/05/05/world/europe/france-coronavirus-timeline.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article\" title=\"\" target=\"blank\">appeared in Europe nearly a month earlier</a> than previously understood and days before Chinese authorities first reported the new illness to the World Health Organization. The first report of an infection in Europe was on Jan. 24 in France.</p>"
        },
        {
            "date": "13 May",
            "title": "A top W.H.O. official said the coronavirus ‘may never go away.’",
            "desc": "<p>Dr. Mike Ryan, the head of the W. H. O.’s health emergencies program, <a class=\"\" href=\"https://twitter.com/WHO/status/1260591340393357312\" title=\"\" rel=\"noopener noreferrer\" target=\"blank\">said the virus</a> may become “just another endemic virus in our communities, and this virus may never go away.” He also tamped down expectations that the invention of a vaccine would provide a quick and complete end to the global crisis.</p>"
        },
        {
            "date": "17 May",
            "title": "Japan and Germany, two of the world’s largest economies, enter recessions.",
            "src": "https://static01.nyt.com/images/2020/06/13/multimedia/13xp-virustimeline-germany/13xp-virustimeline-germany-articleLarge.jpg?quality=90&auto=webp 600w,https://static01.nyt.com/images/2020/06/13/multimedia/13xp-virustimeline-germany/13xp-virustimeline-germany-jumbo.jpg?quality=90&auto=webp 1024w,https://static01.nyt.com/images/2020/06/13/multimedia/13xp-virustimeline-germany/13xp-virustimeline-germany-superJumbo.jpg?quality=90&auto=webp 2048w",
            "desc": "<p>Japan, the world’s third-largest economy after the United States and China, <a class=\"\" href=\"https://www.nytimes.com/2020/05/17/business/japan-recession-coronavirus.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article\" title=\"\" target=\"blank\">fell into a recession</a> for the first time since 2015. Its economy shrank by an annualized rate of 3.4 percent in the first three months of the year. </p><p>Germany, Europe’s largest economy, <a class=\"\" href=\"https://www.nytimes.com/2020/05/15/business/stock-market-today-coronavirus.html?module=STYLN_live_tabs&amp;variant=1_menu&amp;region=header&amp;context=menu&amp;state=default&amp;pgtype=Article\" title=\"\" target=\"blank\">also fell into a recession</a>. Its economy suffered its worst contraction since the 2008 global financial crisis, shrinking by 2.2 percent in the January-March period from the previous quarter.</p>"
        },
        {
            "date": "22 May",
            "title": "Infections in Latin America continue to rise.",
            "src": "https://static01.nyt.com/images/2020/06/13/multimedia/13xp-virustimeline-latin-america/merlin_172837227_62535589-cc2e-46d6-b704-ee40b964ef5b-articleLarge.jpg?quality=90&auto=webp 600w,https://static01.nyt.com/images/2020/06/13/multimedia/13xp-virustimeline-latin-america/merlin_172837227_62535589-cc2e-46d6-b704-ee40b964ef5b-jumbo.jpg?quality=90&auto=webp 1024w,https://static01.nyt.com/images/2020/06/13/multimedia/13xp-virustimeline-latin-america/merlin_172837227_62535589-cc2e-46d6-b704-ee40b964ef5b-superJumbo.jpg?quality=90&auto=webp 2048w",
            "desc": "<p>On May 22, Brazil overtook Russia in reporting the second-highest count of infections worldwide, reaching more than 330,000. Peru and Chile ranked among the hardest-hit countries in the world in terms of infections per capita, around 1 in 300. Data from Ecuador indicated that it was suffering <a class=\"\" href=\"https://www.nytimes.com/2020/04/23/world/americas/ecuador-deaths-coronavirus.html\" title=\"\" target=\"blank\">one of the worst outbreaks in the world</a>. The United States remained the global epicenter, with more than 1.6 million cases and the number of deaths nearing 100,000. </p>"
        },
        {
            "date": "27 May",
            "title": "Coronavirus deaths in the U.S. passed 100,000.",
            "desc": "<p>Four months after the government confirmed the first known case, <a class=\"\" href=\"https://www.nytimes.com/interactive/2020/05/24/us/us-coronavirus-deaths-100000.html\" title=\"\" target=\"blank\">more than 100,000 people</a> who had the coronavirus were recorded dead in the United States. The death toll was far higher than in any other nation around the world.</p>"
        },
        {
            "date": "29 May",
            "title": "India lifted lockdown as its cases skyrocketed.",
            "desc": "<p>More than two months after India went into one of the world’s most severe lockdowns, the country moved to ease restrictions. Experts feared it was the worst timing: Infections were increasing quickly, including among migrant workers, leading to outbreaks in villages across Northern India. Almost half of the country’s 160,000 known cases had been traced to just four cities: New Delhi, Chennai, Ahmedabad and Mumbai, where hospitals had been overwhelmed.</p><p><span class=\"css-8l6xbc evw5hdy0\"> </span></p>"
        },
        {
            "date": "31 May",
            "title": "Large protests drove concerns about new infections.",
            "src": "https://static01.nyt.com/images/2020/07/13/multimedia/13xp-virus-timeline-floyd/merlin_173048400_96bf1c04-1105-4bd5-95b7-704a76bb24ba-articleLarge.jpg?quality=90&auto=webp 600w,https://static01.nyt.com/images/2020/07/13/multimedia/13xp-virus-timeline-floyd/merlin_173048400_96bf1c04-1105-4bd5-95b7-704a76bb24ba-jumbo.jpg?quality=90&auto=webp 1024w,https://static01.nyt.com/images/2020/07/13/multimedia/13xp-virus-timeline-floyd/merlin_173048400_96bf1c04-1105-4bd5-95b7-704a76bb24ba-superJumbo.jpg?quality=90&auto=webp 2048w",
            "desc": "<p>Mass protests over police violence against black Americans, in the wake of <a class=\"\" href=\"https://www.nytimes.com/2020/05/27/us/george-floyd-minneapolis-death.html\" title=\"\" target=\"blank\">George Floyd’s death</a> in custody of the Minneapolis Police, spurred concerns that the gatherings <a class=\"\" href=\"https://www.nytimes.com/2020/05/31/health/protests-coronavirus.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article\" title=\"\" target=\"blank\">could lead to new outbreaks.</a> By May 31, there had been protests in at least 75 U.S. cities. Demonstrations in many places around the United States, including in New York City <a class=\"\" href=\"https://www.nytimes.com/2020/07/01/nyregion/nyc-coronavirus-protests.html\" title=\"\" target=\"blank\">where most protesters wore masks</a>, did not produce a surge in cases.</p>"
        },
        {
            "date": "04 Jun",
            "title": "Coronavirus tore into regions previously spared.",
            "desc": "<p>The number of known cases across the globe grew faster than ever, <a class=\"\" href=\"https://www.nytimes.com/2020/06/04/world/middleeast/coronavirus-egypt-america-africa-asia.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article\" title=\"\" target=\"blank\">with more than 100,000 new infections a day</a>. Densely populated, low- and middle-income countries across the Middle East, Latin America, Africa and South Asia were hit the hardest, suggesting bad news for strongmen and populists who once reaped political points by vaunting low infection rates as evidence of their leadership’s virtues.</p><p> </p>"
        },
        {
            "date": "09 Jun",
            "title": "Moscow ended lockdown.",
            "src": "https://static01.nyt.com/images/2020/07/13/multimedia/13xp-virus-timeline-moscow/merlin_173361867_8226c69c-7117-40e9-a051-940480463038-articleLarge.jpg?quality=90&auto=webp 600w,https://static01.nyt.com/images/2020/07/13/multimedia/13xp-virus-timeline-moscow/merlin_173361867_8226c69c-7117-40e9-a051-940480463038-jumbo.jpg?quality=90&auto=webp 1024w,https://static01.nyt.com/images/2020/07/13/multimedia/13xp-virus-timeline-moscow/merlin_173361867_8226c69c-7117-40e9-a051-940480463038-superJumbo.jpg?quality=90&auto=webp 2048w",
            "desc": "<p>Moscow’s lockdown ended on June 9 as a nationwide vote on extending President Vladimir V. Putin’s rule loomed, and as the city reported more than 1,000 daily new cases. Barbershops, beauty salons and other businesses were allowed to reopen. One day before the lockdown was lifted, Mayor Sergei S. Sobyanin said the <a class=\"\" href=\"https://www.nytimes.com/2020/05/11/world/europe/coronavirus-deaths-moscow.html\" title=\"\" target=\"blank\">spread of the coronavirus in the capita</a>l had slowed and that the city’s shelter-in-place measures, some of the world’s most stringent outside of China, could be lifted.</p>"
        },
        {
            "date": "11 Jun",
            "title": "Coronavirus cases in Africa topped 200,000.",
            "desc": "<p>The W.H.O. said that it took Africa 98 days to reach 100,000 coronavirus cases, but only <a class=\"\" href=\"https://news.un.org/en/story/2020/06/1066142\" title=\"\" rel=\"noopener noreferrer\" target=\"blank\">18 days for that figure to double</a>. While the sharp rise in cases could be explained by an increase in testing, the agency said, more than half of the 54 countries on the continent were experiencing community transmissions. Ten countries were driving the rise in numbers and accounted for nearly 80 percent of all cases. South Africa has a quarter of the total cases.</p>"
        },
        {
            "date": "17 Jun",
            "title": "The outbreak surged, with clusters on several continents.",
            "src": "https://static01.nyt.com/images/2020/07/13/multimedia/13xp-virus-timeline-capetown/merlin_173581560_8e938dcc-d6e0-4c84-83a6-75c572f15f66-articleLarge.jpg?quality=90&auto=webp 600w,https://static01.nyt.com/images/2020/07/13/multimedia/13xp-virus-timeline-capetown/merlin_173581560_8e938dcc-d6e0-4c84-83a6-75c572f15f66-jumbo.jpg?quality=90&auto=webp 1024w,https://static01.nyt.com/images/2020/07/13/multimedia/13xp-virus-timeline-capetown/merlin_173581560_8e938dcc-d6e0-4c84-83a6-75c572f15f66-superJumbo.jpg?quality=90&auto=webp 2048w",
            "desc": "<p>Outbreaks in Latin America, Africa, South Asia and the United States continued to drive the global caseload. On June 16, more than 140,000 cases were reported and another 166,000 on June 17, two of the three highest tallies since the outbreak began. Seventy-seven nations have seen a growth in new cases over the past two weeks, while only 43 have seen declines.</p>"
        },
        {
            "date": "20 Jun",
            "title": "Southern U.S. states saw sharp rise in cases.",
            "src": "https://static01.nyt.com/images/2020/07/13/multimedia/13xp-virus-timeline-miami/merlin_173679186_7f178475-6ba0-4cc4-9dcd-441137d065bd-articleLarge.jpg?quality=90&auto=webp 600w,https://static01.nyt.com/images/2020/07/13/multimedia/13xp-virus-timeline-miami/merlin_173679186_7f178475-6ba0-4cc4-9dcd-441137d065bd-jumbo.jpg?quality=90&auto=webp 1024w,https://static01.nyt.com/images/2020/07/13/multimedia/13xp-virus-timeline-miami/merlin_173679186_7f178475-6ba0-4cc4-9dcd-441137d065bd-superJumbo.jpg?quality=90&auto=webp 2048w",
            "desc": "<p>On June 20, for the third straight day, Florida and South Carolina broke their single-day records for new cases. The news came as infection levels for Missouri and Nevada also reached new highs. On June 19, the United States reported more than 30,000 new infections, its highest since May 1, with cases rising in 19 states across the South, West and Midwest.</p>"
        },
        {
            "date": "22 Jun",
            "title": "Saudi Arabia imposed strict limits on this year’s hajj.",
            "desc": "<p>Saudi Arabia <a class=\"\" href=\"https://www.nytimes.com/2020/06/22/world/middleeast/saudi-arabia-hajj-mecca-pilgrims.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article\" title=\"\" target=\"blank\">announced</a> that this year’s hajj, the annual pilgrimage to Mecca for Muslims, would welcome “very limited numbers” to prevent the spread of the coronavirus. The authorities said that the event, scheduled for July, would allow only Saudi pilgrims and noncitizens already inside the kingdom.</p><p> </p>"
        },
        {
            "date": "30 Jun",
            "title": "The E.U. said it would reopen borders.",
            "desc": "<p>The European Union <a class=\"\" href=\"https://www.nytimes.com/2020/06/30/world/europe/eu-reopening-blocks-us-travelers.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article\" title=\"\" target=\"blank\">prepared to open to visitors</a> from 15 countries on July 1, but not to travelers from the United States, Brazil or Russia. The move puts into effect a complex policy that seeks to balance health concerns with politics, diplomacy and the desperate need for tourism revenue. Australia, Canada and New Zealand were among the approved list of countries. Travelers from China will be permitted if China reciprocates.</p>"
        },
        {
            "date": "01 Jul",
            "title": "Iran announced new lockdown measures.",
            "src": "https://static01.nyt.com/images/2020/07/21/multimedia/21xp-virus-timeline-iran/merlin_174312450_9edb3115-7605-4e99-82be-ce2e65405ab8-articleLarge.jpg?quality=90&auto=webp 600w,https://static01.nyt.com/images/2020/07/21/multimedia/21xp-virus-timeline-iran/merlin_174312450_9edb3115-7605-4e99-82be-ce2e65405ab8-jumbo.jpg?quality=90&auto=webp 1024w,https://static01.nyt.com/images/2020/07/21/multimedia/21xp-virus-timeline-iran/merlin_174312450_9edb3115-7605-4e99-82be-ce2e65405ab8-superJumbo.jpg?quality=90&auto=webp 2048w",
            "desc": "<p>As hospitals in Iran filled and the death toll climbed, officials announced new shutdown measures in cities across 11 provinces. Eight provinces, including Tehran, the capital, were among the areas considered red zones. The partial shutdown in Tehran restricted movement, cut work hours and banned large gatherings like weddings and funerals.</p>"
        },
        {
            "date": "06 Jul",
            "title": "U.S. deaths surpassed 130,000.",
            "desc": "<p>Dr. Anthony S. Fauci, the nation’s top infectious disease expert, warned that the country was still “knee-deep in the first wave” of the pandemic, with more than 130,000 coronavirus deaths and nearly three million cases. Dr. Fauci said that having more than 50,000 new cases a day recorded several times in the past week was “a serious situation that we have to address immediately.”</p>"
        },
        {
            "date": "07 Jul",
            "title": "The Trump administration sent formal notice of U.S. withdrawal from the W.H.O.",
            "desc": "<p>The Trump administration notified the United Nations that the United States was withdrawing from the W.H.O. effective July 6, 2021. The move would cut off the organization’s biggest sources of aid.</p>"
        },
        {
            "date": "07 Jul",
            "title": "Brazil’s president tested positive.",
            "desc": "<p>President Jair Bolsonaro of Brazil <a class=\"\" href=\"https://www.nytimes.com/2020/07/07/world/americas/brazil-bolsonaro-coronavirus.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article\" title=\"\" target=\"blank\">disclosed on July 7</a> that he had been infected with the virus, saying that he was tested after experiencing fatigue, muscle pain and a fever. The news came after months of denying the seriousness of the pandemic and brushing aside protective measures, and after more than 65,000 Brazilians had died. </p>"
        },
        {
            "date": "10 Jul",
            "title": "U.S. set seven records in 11 days. ",
            "src": "https://static01.nyt.com/images/2020/07/21/multimedia/21xp-virus-timeline-nc/merlin_174392388_13e28638-4b18-4a4e-800b-f5da294ac1d0-articleLarge.jpg?quality=90&auto=webp 600w,https://static01.nyt.com/images/2020/07/21/multimedia/21xp-virus-timeline-nc/merlin_174392388_13e28638-4b18-4a4e-800b-f5da294ac1d0-jumbo.jpg?quality=90&auto=webp 1024w,https://static01.nyt.com/images/2020/07/21/multimedia/21xp-virus-timeline-nc/merlin_174392388_13e28638-4b18-4a4e-800b-f5da294ac1d0-superJumbo.jpg?quality=90&auto=webp 2048w",
            "desc": "<p>On July 10, the United States reached 68,000 new cases for the first time, setting a single-day record for the seventh time in 11 days. The infection rate was underscored by alarming growth in the South and West. At least six states had also reported single-day records for new cases: Georgia, Utah, Montana, North Carolina, Iowa and Ohio.</p>"
        },
        {
            "date": "10 Jul",
            "title": "Hong Kong shut down schools amid a third wave.",
            "desc": "<p>Hong Kong, a city of seven million, has reported more than 1,400 cases and seven deaths. But on July 10, it shut down its school system as it worked to contain a third wave of infections, which official reported included 38 new cases. </p><p>The third wave, which comes after <a class=\"\" href=\"https://www.nytimes.com/2020/03/31/world/asia/coronavirus-china-hong-kong-singapore-south-korea.html\" title=\"\" target=\"blank\">infections surged in March</a> and were contained by May, was a setback for a city that had <a class=\"\" href=\"https://www.nytimes.com/2020/05/19/world/asia/coronavirus-hong-kong.html\" title=\"\" target=\"blank\">largely returned to normal</a>, with restaurants enjoying packed crowds and workers returning to offices.</p>"
        },
        {
            "date": "11 Jul",
            "title": "President Trump publicly wore a mask for the first time.",
            "src": "https://static01.nyt.com/images/2020/07/21/multimedia/21xp-virus-timeline-trump/merlin_174475983_576b5ec1-972a-42cc-ab6f-08cdcba37ed4-articleLarge.jpg?quality=90&auto=webp 600w,https://static01.nyt.com/images/2020/07/21/multimedia/21xp-virus-timeline-trump/merlin_174475983_576b5ec1-972a-42cc-ab6f-08cdcba37ed4-jumbo.jpg?quality=90&auto=webp 1024w,https://static01.nyt.com/images/2020/07/21/multimedia/21xp-virus-timeline-trump/merlin_174475983_576b5ec1-972a-42cc-ab6f-08cdcba37ed4-superJumbo.jpg?quality=90&auto=webp 2048w",
            "desc": "<p>President Trump wore a mask in public for the first time during a visit to Walter Reed National Military Medical Center, following repeated urging from aides that it was a necessary message to send to Americans resistant to covering their faces. The president had repeatedly <a class=\"\" href=\"https://www.nytimes.com/video/us/politics/100000007070943/trump-mask-coronavirus.html\" title=\"\" target=\"blank\">dismissed suggestions</a> that he wear a mask, frequently appearing in public spaces without one and ignoring public health rules in several states.</p>"
        },
        {
            "date": "13 Jul",
            "title": "More than five million Americans lost health insurance.",
            "desc": "<p>The coronavirus pandemic stripped an estimated 5.4 million Americans of their health insurance between February and May, a period in which more adults became uninsured because of job losses than have ever lost coverage in a single year, <a class=\"\" href=\"https://www.nytimes.com/2020/07/13/us/politics/coronavirus-health-insurance-trump.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article\" title=\"\" target=\"blank\">according to a study</a>.</p>"
        },
        {
            "date": "15 Jul",
            "title": "Tokyo raised its pandemic alert level.",
            "src": "https://static01.nyt.com/images/2020/07/21/multimedia/21xp-virus-timeline-tokyo/merlin_174618894_b114ae56-eb4e-4aa0-b382-833fc9ed21cc-articleLarge.jpg?quality=90&auto=webp 600w,https://static01.nyt.com/images/2020/07/21/multimedia/21xp-virus-timeline-tokyo/merlin_174618894_b114ae56-eb4e-4aa0-b382-833fc9ed21cc-jumbo.jpg?quality=90&auto=webp 1024w,https://static01.nyt.com/images/2020/07/21/multimedia/21xp-virus-timeline-tokyo/merlin_174618894_b114ae56-eb4e-4aa0-b382-833fc9ed21cc-superJumbo.jpg?quality=90&auto=webp 2048w",
            "desc": "<p>Days after new cases hit record highs, Tokyo raised its alert level to “red,” its highest. In the week before, Tokyo recorded two consecutive daily records with a peak of 243 cases on July 10. Since February, the sprawling metropolis of 14 million had reported a total of just under 8,200 cases and 325 deaths.</p>"
        },
        {
            "date": "16 Jul",
            "title": "A study in South Korea found that older children spread the virus comparably to adults.",
            "desc": "<p>While school districts around the United States struggle with reopening plans, <a class=\"\" href=\"https://wwwnc.cdc.gov/eid/article/26/10/20-1315_article\" title=\"\" rel=\"noopener noreferrer\" target=\"blank\">a study from South Korea</a> offered a note of caution. It found that children between the ages of 10 and 19 can spread the virus at least as well as adults do, suggesting that middle and high schools in particular may seed new clusters of infection. Children younger than 10 transmit to others much less often, according to the study, although the risk is not zero.</p>"
        },
        {
            "date": "17 Jul",
            "title": "India reached a million coronavirus cases, and lockdowns were reimposed.",
            "src": "https://static01.nyt.com/images/2020/07/21/multimedia/21xp-virus-timeline-india/21xp-virus-timeline-india-articleLarge.jpg?quality=90&auto=webp 600w,https://static01.nyt.com/images/2020/07/21/multimedia/21xp-virus-timeline-india/21xp-virus-timeline-india-jumbo.jpg?quality=90&auto=webp 1024w,https://static01.nyt.com/images/2020/07/21/multimedia/21xp-virus-timeline-india/21xp-virus-timeline-india-superJumbo.jpg?quality=90&auto=webp 2048w",
            "desc": "<p>India on July 17 surpassed <a class=\"\" href=\"https://www.nytimes.com/2020/07/16/world/asia/coronavirus-india-million-cases.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article\" title=\"\" target=\"blank\">one million confirmed infections</a> and 25,000 deaths. The milestones came as several states and cities had reimposed total and partial lockdowns and as the country ranked third in the world in infections behind the United States and Brazil. While India’s caseloads continued to climb, researchers at the <a class=\"\" href=\"https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3635047\" title=\"\" rel=\"noopener noreferrer\" target=\"blank\">Massachusetts Institute of Technology</a> estimated that by the end of next year, India would have the worst outbreak in the world.</p>"
        },
        {
            "date": "17 Jul",
            "title": "Israel announced new restrictions.",
            "desc": "<p>As the number of new coronavirus infections continued to climb in Israel and the government faced further criticism of its handling of the pandemic, Prime Minister Benjamin Netanyahu’s Office and the Health Ministry announced new restrictions on gyms, restaurants and beaches. Since late June, infections in Israel had soared. The nation had been averaging more than 1,500 cases a day, up from 664 two weeks before.</p>"
        },
        {
            "date": "21 Jul",
            "title": "European leaders agreed on a $857 billion stimulus package.",
            "desc": "<p>European Union leaders on July 21 <a class=\"\" href=\"https://www.nytimes.com/2020/07/20/world/europe/eu-stimulus-coronavirus.html?action=click&amp;module=RelatedLinks&amp;pgtype=Article\" title=\"\" target=\"blank\">agreed on a large spending package</a> to rescue their economies from the ruins caused by the pandemic. The $857 billion stimulus agreement will benefit nations hit hardest by the pandemic.</p>"
        }
    ]
}