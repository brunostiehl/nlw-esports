import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import { convertHourStringToMinutes } from './utils/convert-hour-string-to-minutes'
import { convertMinutesToHourString } from './utils/convert-minutes-to-hour-string'

const app = express()
app.use(express.json()) // permite que o express entenda dados no formato JSON recebidos no corpo da requisição
app.use(cors({
    // origin: 'http://logne.com.br', // permite que apenas o domínio informado faça requisições para a API
}))

const prisma = new PrismaClient({
    log: ['query']
})

app.get('/games', async (request, response) => {
    const games = await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true,
                }
            }
        }
    })

    return response.json(games)
})

app.post('/games/:id/ads', async (request, response) => {
    const gameId = request.params.id
    const body = request.body

    // TODO validação dos dados recebidos na requisição com a biblioteca zod (https://github.com/colinhacks/zod)

    const ad = await prisma.ad.create({
       data: {
        gameId,
        name: body.name,
        weekDays: body.weekDays.join(','),
        useVoiceChannel: body.useVoiceChannel,
        yearsPlaying: body.yearsPlaying,
        hourStart: convertHourStringToMinutes(body.hourStart),
        hourEnd: convertHourStringToMinutes(body.hourEnd),
        discord: body.discord,
       } 
    })

    return response.status(201).json(ad)
})

app.get('/ads', (request, response) => {
    // return response.send('Chegou Ads')
    return response.json([
        {id: 1, name: "Anúncio 1"},
        {id: 2, name: "Anúncio 2"},
        {id: 3, name: "Anúncio 3"},
        {id: 4, name: "Anúncio 4"},
    ])
})

app.get('/games/:id/ads', async (request, response) => {
    const gameId = request.params.id

    const ads = await prisma.ad.findMany({ // função para retornar todos os registros que encontrar
        select: { // seleciona os campos que serão retornados do banco
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hourStart: true,
            hourEnd: true,
        },
        where: { 
            gameId: gameId
        },
        orderBy: { // ordenação dos dados com base na data de criação
            createdAt: 'desc'
        }
    })

    return response.send(ads.map(ad => {
        return {
            ...ad, // retorna todos os campos da tabela Ad, na mesma forma que estão vindo do banco (spread operator)
            weekDays: ad.weekDays.split(','), // altera o retorno dos dados apenas para o campo weekDays
            hourStart: convertMinutesToHourString(ad.hourStart),
            hourEnd: convertMinutesToHourString(ad.hourEnd),
        }
    }))
})

app.get('/ads/:id/discord', async (request, response) => {
    const adId = request.params.id

    const ad = await prisma.ad.findUniqueOrThrow({ // função para tentar encontrar um ad com o ID passado na requisição (se não encontrar, retorna um erro)
        select: {
            discord: true,
        },
        where: {
            id: adId,
        }
    })

    return response.json({
        discord: ad.discord,
    })
})

app.listen(3333)