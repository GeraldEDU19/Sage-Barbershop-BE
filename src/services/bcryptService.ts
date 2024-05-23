import bcrypt from 'bcryptjs';

class BcryptService {
    private customSalt: string;
    private saltRounds: number;

    constructor() {
        // Retrieve custom salt from process.env or use a default value
        this.customSalt = process.env.CUSTOM_SALT || '$2a$10$fQX5OlI.Pc7R0VtYo2a7KO';
        this.saltRounds = 10; // Number of rounds to generate the salt
    }

    // Function to encrypt a text (e.g., a password) with a custom salt
    async encryptText(text: string): Promise<string> {
        try {
            // Use the custom salt to encrypt the text
            const hash = await bcrypt.hash(text, this.customSalt);
            return hash;
        } catch (error) {
            console.error('Error encrypting text:', error);
            throw new Error('Error encrypting text');
        }
    }

    // Function to verify if a text matches an encrypted hash
    async compareText(text: string, hashedText: string): Promise<boolean> {
        try {
            // Compare the unencrypted text with the encrypted hash
            const result = await bcrypt.compare(text, hashedText);
            return result;
        } catch (error) {
            console.error('Error comparing encrypted text:', error);
            throw new Error('Error comparing encrypted text');
        }
    }
}

export default BcryptService;
