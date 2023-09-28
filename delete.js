import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"

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
			case "DELETE /items/{id}":
				await dynamo.send(
					new DeleteCommand({
						TableName: tableName,
						Key: {
							id: event.pathParameters.id,
						},
					})
				)
				body = `Deleted item ${event.pathParameters.id}`
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
