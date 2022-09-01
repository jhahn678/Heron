import { gql } from 'apollo-server-core'

export const typeDef = gql`
    enum ClassificationEnum {
        bay
        bayou
        beach
        creek
        lagoon
        lake
        pond
        reservoir
        river
        stream
        strait
    }

    enum AdminOneEnum {
        aguascalientes
        alabama
        alaska
        alberta
        arizona
        arkansas
        bajaCalifornia
        bajaCaliforniaSur
        britishColumbia
        california
        campeche
        chiapas
        chihuahua
        coahuila
        colima
        colorado
        connecticut
        delaware
        districtOfColumbia
        distritoFederal
        durango
        florida
        georgia
        guanajuato
        guerrero
        hawaii
        hidalgo
        idaho
        illinois
        indiana
        iowa
        jalisco
        kansas
        kentucky
        kommuneKujalleq
        kommuneqarfikSermersooq
        louisiana
        maine
        manitoba
        maryland
        massachusetts
        michigan
        michoacan
        minnesota
        mississippi
        missouri
        montana
        morelos
        mexico
        nationalparken
        nayarit
        nebraska
        nevada
        newBrunswick
        newHampshire
        newJersey
        newMexico
        newYork
        newfoundlandAndLabrador
        northCarolina
        northDakota
        northwestTerritories
        novaScotia
        nuevoLeon
        nunavat
        nunavut
        oaxaca
        ohio
        oklahoma
        ontario
        oregon
        pennsylvania
        pituffik
        princeEdwardIsland
        puebla
        qaasuitsupKommunia
        qeqqataKommunia
        queretaro
        quintanaRoo
        quebec
        rhodeIsland
        sanLuisPotosi
        saskatchewan
        sinaloa
        sonora
        southCarolina
        southDakota
        tabasco
        tamaulipas
        tennesse
        tennessee
        texas
        tlaxcala
        utah
        veracruz
        vermont
        virginia
        washington
        westVirginia
        wisconsin
        wyoming
        yucatan
        yukon
        zacatecas
    }
`

export const resolver = {
    AdminOneEnum: {
        aguascalientes: "Aguascalientes",
        alabama: "Alabama",
        alaska: "Alaska",
        alberta: "Alberta",
        arizona: "Arizona",
        arkansas: "Arkansas",
        bajaCalifornia: "Baja California",
        bajaCaliforniaSur: "Baja California Sur",
        britishColumbia: "British Columbia",
        california: "California",
        campeche: "Campeche",
        chiapas: "Chiapas",
        chihuahua: "Chihuahua",
        coahuila: "Coahuila",
        colima: "Colima",
        colorado: "Colorado",
        connecticut: "Connecticut",
        delaware: "Delaware",
        districtOfColumbia: "District of Columbia",
        distritoFederal: "Distrito Federal",
        durango: "Durango",
        florida: "Florida",
        georgia: "Georgia",
        guanajuato: "Guanajuato",
        guerrero: "Guerrero",
        hawaii: "Hawaii",
        hidalgo: "Hidalgo",
        idaho: "Idaho",
        illinois: "Illinois",
        indiana: "Indiana",
        iowa: "Iowa",
        jalisco: "Jalisco",
        kansas: "Kansas",
        kentucky: "Kentucky",
        kommuneKujalleq: "Kommune Kujalleq",
        kommuneqarfikSermersooq: "Kommuneqarfik Sermersooq",
        louisiana: "Louisiana",
        maine: "Maine",
        manitoba: "Manitoba",
        maryland: "Maryland",
        massachusetts: "Massachusetts",
        michigan: "Michigan",
        michoacan: "Michoacán",
        minnesota: "Minnesota",
        mississippi: "Mississippi",
        missouri: "Missouri",
        montana: "Montana",
        morelos: "Morelos",
        mexico: "México",
        nationalparken: "Nationalparken",
        nayarit: "Nayarit",
        nebraska: "Nebraska",
        nevada: "Nevada",
        newBrunswick: "New Brunswick",
        newHampshire: "New Hampshire",
        newJersey: "New Jersey",
        newMexico: "New Mexico",
        newYork: "New York",
        newfoundlandAndLabrador: "Newfoundland and Labrador",
        northCarolina: "North Carolina",
        northDakota: "North Dakota",
        northwestTerritories: "Northwest Territories",
        novaScotia: "Nova Scotia",
        nuevoLeon: "Nuevo León",
        nunavat: "Nunavat",
        nunavut: "Nunavut",
        oaxaca: "Oaxaca",
        ohio: "Ohio",
        oklahoma: "Oklahoma",
        ontario: "Ontario",
        oregon: "Oregon",
        pennsylvania: "Pennsylvania",
        pituffik: "Pituffik",
        princeEdwardIsland: "Prince Edward Island",
        puebla: "Puebla",
        qaasuitsupKommunia: "Qaasuitsup Kommunia",
        qeqqataKommunia: "Qeqqata Kommunia",
        queretaro: "Querétaro",
        quintanaRoo: "Quintana Roo",
        quebec: "Québec",
        rhodeIsland: "Rhode Island",
        sanLuisPotosi: "San Luis Potosí",
        saskatchewan: "Saskatchewan",
        sinaloa: "Sinaloa",
        sonora: "Sonora",
        southCarolina: "South Carolina",
        southDakota: "South Dakota",
        tabasco: "Tabasco",
        tamaulipas: "Tamaulipas",
        tennesse: "Tennesse",
        tennessee: "Tennessee",
        texas: "Texas",
        tlaxcala: "Tlaxcala",
        utah: "Utah",
        veracruz: "Veracruz",
        vermont: "Vermont",
        virginia: "Virginia",
        washington: "Washington",
        westVirginia: "West Virginia",
        wisconsin: "Wisconsin",
        wyoming: "Wyoming",
        yucatan: "Yucatán",
        yukon: "Yukon",
        zacatecas: "Zacatecas"
    }
}