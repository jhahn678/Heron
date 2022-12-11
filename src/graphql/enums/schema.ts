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

