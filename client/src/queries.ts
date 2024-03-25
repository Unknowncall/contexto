import axios from 'axios';

export const guessWord = async (word: string, date: string): Promise<number> => {
    const { data } = await axios.get(`http://localhost:3000/api/guess/${date}/${word}`);
    return data.distance;
}

export const getPlayableDates = async (): Promise<string[]> => {
    const { data } = await axios.get('http://localhost:3000/api/dates');
    return data;
}

export const getLatestDate = async (): Promise<string> => {
    const { data } = await axios.get('http://localhost:3000/api/latest');
    return data;
}

export const getIndexOfDate = async (date: string): Promise<number> => {
    const { data } = await axios.get(`http://localhost:3000/api/getIndexOfDate/${date}`);
    return data;
}
