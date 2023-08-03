import fs from 'fs';

function readFile(fileName: string) {
    const fileData: string = fs.readFileSync(fileName, 'utf-8');
    const regex: RegExp = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}) .+ "(GET \/[^\/\s]+\/[^\/\s]+\/[^\/\s]+)\/[^"]*" (\d{3})/g;

    const endpointCountMap = new Map<string, number>();
    const minuteCountMap = new Map<string, number>();
    const statusCodeCountMap = new Map<string, number>();

    let match: RegExpExecArray | null;
    while ((match = regex.exec(fileData)) !== null) {
        const [_, timestamp, endpoint, statusCode] = match; // Destructure the matched data
        // Update endpoint count
        endpointCountMap.set(endpoint, (endpointCountMap.get(endpoint) || 0) + 1);
        // Update minute count
        const minute = timestamp.slice(0, 16);
        minuteCountMap.set(minute, (minuteCountMap.get(minute) || 0) + 1);
        // Update status code count
        statusCodeCountMap.set(statusCode, (statusCodeCountMap.get(statusCode) || 0) + 1);
    }

    const endpointStats = Array.from(endpointCountMap, ([endpoint, count]) => ({ Endpoint: endpoint, 'Call Count': count }));
    const minuteStats = Array.from(minuteCountMap, ([minute, count]) => ({ Minute: minute, 'Call Count': count }));
    const statusCodeStats = Array.from(statusCodeCountMap, ([statusCode, count]) => ({ 'Status Code': statusCode, 'Call Count': count }));

    return {
        endpointStats,
        minuteStats,
        statusCodeStats,
    };
}

// provide the log file name here to read the file
const result = readFile("./logFiles/api-prod-out.log");

console.log("Endpoint Stats:");
console.table(result.endpointStats);
console.log("\nMinute Stats:");
console.table(result.minuteStats);
console.log("\nStatus Code Stats:");
console.table(result.statusCodeStats);