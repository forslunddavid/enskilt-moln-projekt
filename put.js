import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"

const client = new DynamoDBClient({})
const dynamo = DynamoDBDocumentClient.from(client)
const tableName = "http-crud-tutorial-items"

export const handler = async (event, context) => {
	let body
	let statusCode = 200
	const headers = {
		"Content-Type": "application/json",
	}

	try {
		switch (event.routeKey) {
			case "PUT /items/{id}":
				let requestJSON = JSON.parse(event.body)
				await dynamo.send(
					new PutCommand({
						TableName: tableName,
						Item: {
							id: requestJSON.id,
							price: requestJSON.price,
							name: requestJSON.name,
						},
					})
				)
				body = `Put item ${requestJSON.id}`
				break
			default:
				throw new Error(`Unsupported route: "${event.routeKey}"`)
		}
	} catch (err) {
		statusCode = 400
		body = err.message
	} finally {
		body = JSON.stringify(body)
	}
	return {
		statusCode,
		body,
		headers,
	}
}
