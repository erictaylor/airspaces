# ✈️ Airspaces

## Introduction

This is a personal project of Eric Taylor's to create custom OpenAIR airspace files to use while flying with [Gaggle](https://flygaggle.com/).

Gaggle uses [OpenAIP](https://www.openaip.net/) airspace database to display airspaces on their map. There are lots of missing airspaces in OpenAIP as it relates to the locations I fly in.

This project is setup to create custom OpenAIR airspace files that can be uploaded to Gaggle to display airspaces that are not in OpenAIP and fill in the gaps.

## How to use

1. Using the links below in "Airspace Files", download the custom airspace file you want to use to your phone with Gaggle installed.
2. Upload the airspace file to Gaggle by navigating the "Airspaces" section under the "Explore" tab. To upload the file you need to provide a name, description, and the airspace file itself. [See instructions](https://flygaggle.com/help/items/airspaces-personal/).

## Airspace Files

- [KSGU - St. George, UT 🔗](https://raw.githubusercontent.com/erictaylor/airspaces/main/airspaces/ksgu-airspaces.txt)

  This file contains the class E2 and E4 transition areas airspaces for KSGU airport in St. George, UT (ie St. George Regional Airport), as established in [FR Doc. 2017-16282](https://www.federalregister.gov/documents/2017/08/03/2017-16282/establishment-of-class-e-airspace-and-amendment-of-class-e-airspace-st-george-ut).
  
- [KSGU - St. George, UT - Ultralight Restrictions 🔗](https://raw.githubusercontent.com/erictaylor/airspaces/main/airspaces/ksgu-ultralight-restricted-airspaces.txt)

  This file contains airspace at the St. George Regional Airport (KSGU) that should be considered restricted (ie no fly zone) to ultralight vehicles ([FAR Part 103](https://www.ecfr.gov/current/title-14/chapter-I/subchapter-F/part-103)). These restrictions were drafted in conjunction with the KSGU airport manager to satisfy [FAR 103.17](https://www.ecfr.gov/current/title-14/chapter-I/subchapter-F/part-103/subpart-B/section-103.17) for authorized pilots.
  * Pilots should stay out of the spaces marked restricted per this file.
  * Pilots should stay below 500' AGL inside the official E2 and E4 transition airspaces.
  
  Any questions or concerns should be directed to the KSGU airport manager.

## Additional Resources

- [Understanding Class E Airspace](https://www.faa.gov/sites/faa.gov/files/uas/resources/events_calendar/archive/How_To_Understand_and_Operate_in_Class_E.pdf)
- [OpenAIR Format](http://www.winpilot.com/usersguide/userairspace.asp)
- [OpenAIR Fix Format](https://github.com/openAIP/openaip-openair-fix-format)
- [OpenAIR parser](https://github.com/openAIP/openaip-openair-parser)

## License

[MIT](/LICENSE.md) © [Eric Taylor](https://github.com/erictaylor)
