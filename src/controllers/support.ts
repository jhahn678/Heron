import { Request } from 'express'
import { asyncWrapper } from "../utils/errors/asyncWrapper"

interface ReportProblemReq {
    category: string
    body: string
}

export const reportProblem = asyncWrapper(async(req: Request<{},{},ReportProblemReq>, res) => {
    const { category, body } = req.body;
    res.status(204).json({ message: 'Endpoint not operational' })
})