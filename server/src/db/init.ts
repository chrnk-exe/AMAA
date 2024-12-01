import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';

export const stringTypes = {
	STRING: 'string' as const,
	HIGH_ENTROPY:'high_entropy' as const,
	REGEX: 'regex' as const,
	SUS_WORD: 'sus_word' as const
};

export const scanTypes = {
	STATIC: 'static' as const,
	DYNAMIC: 'dynamic' as const
};

export const scanStatus = {
	IN_PROGRESS: 'in_process' as const,
	FINISHED: 'finished' as const,
	CANCALLED: 'cancelled' as const
};

export const hardcodedCertType = {
	HARDCODED_CERT: 'cert'  as const,
	HARDCODED_KEYSTORE: 'keystore'  as const
};

export async function initializeDatabase(DB_PATH: string) {
	// Проверяем и создаём директорию, если требуется
	const dbDir = path.dirname(DB_PATH);
	if (!fs.existsSync(dbDir)) {
		fs.mkdirSync(dbDir, { recursive: true });
	}

	// Создаём подключение к базе данных (если файл отсутствует, он будет создан автоматически)
	const db = await open({
		filename: DB_PATH,
		driver: sqlite3.Database,
	});

	console.log(`Используется база данных по пути: ${DB_PATH}`);

	try {
		// Создаём таблицу для сканов
		await db.exec(`
      CREATE TABLE IF NOT EXISTS scans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        app_name TEXT NOT NULL,
        package_name TEXT NOT NULL,
        version TEXT NOT NULL,
        current_step TEXT,
        scan_type TEXT NOT NULL CHECK (scan_type IN ('static', 'dynamic')),
        status TEXT NOT NULL CHECK (status IN ('in_process', 'finished', 'cancelled')),
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        finished_at TEXT
      );
    `);

		// Таблица для статических результатов
		await db.exec(`
      CREATE TABLE IF NOT EXISTS static_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        scan_id INTEGER NOT NULL,
        cert_version TEXT NOT NULL,
        hardcoded_cert TEXT,
        dangerous_permissions TEXT,
        min_sdk INTEGER,
        max_sdk INTEGER,
        critical_attributes INTEGER CHECK (critical_attributes BETWEEN 0 AND 7),
        FOREIGN KEY (scan_id) REFERENCES scans (id)
      );
    `);

		// Таблица для динамических результатов
		await db.exec(`
      CREATE TABLE IF NOT EXISTS dynamic_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        scan_id INTEGER NOT NULL,
        ssl_pinning_bypassed BOOLEAN NOT NULL,
        FOREIGN KEY (scan_id) REFERENCES scans (id)
      );
    `);

		// Таблицы для проверок статического анализа
		await db.exec(`
      CREATE TABLE IF NOT EXISTS exported_components (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        static_result_id INTEGER NOT NULL,
        category TEXT NOT NULL,
        name TEXT NOT NULL,
        FOREIGN KEY (static_result_id) REFERENCES static_results (id)
      );

      CREATE TABLE IF NOT EXISTS intent_filters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        static_result_id INTEGER NOT NULL,
        path_patterns TEXT,
        path_prefixes TEXT,
        paths TEXT,
        schemes TEXT,
        hosts TEXT,
        FOREIGN KEY (static_result_id) REFERENCES static_results (id)
      );

      CREATE TABLE IF NOT EXISTS domains_found (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        static_result_id INTEGER NOT NULL,
        domain TEXT NOT NULL,
        file_path TEXT NOT NULL,
        FOREIGN KEY (static_result_id) REFERENCES static_results (id)
      );

      CREATE TABLE IF NOT EXISTS unsafe_methods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        static_result_id INTEGER NOT NULL,
        method TEXT NOT NULL,
        file_path TEXT NOT NULL,
        FOREIGN KEY (static_result_id) REFERENCES static_results (id)
      );

      CREATE TABLE IF NOT EXISTS sql_expressions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        static_result_id INTEGER NOT NULL,
        expression TEXT NOT NULL,
        file_path TEXT NOT NULL,
        FOREIGN KEY (static_result_id) REFERENCES static_results (id)
      );

      CREATE TABLE IF NOT EXISTS weak_crypto (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        static_result_id INTEGER NOT NULL,
        method TEXT NOT NULL,
        file_path TEXT NOT NULL,
        FOREIGN KEY (static_result_id) REFERENCES static_results (id)
      );

		CREATE TABLE IF NOT EXISTS high_entropy_strings (
		  id INTEGER PRIMARY KEY AUTOINCREMENT,
		  static_result_id INTEGER NOT NULL,
		  string TEXT NOT NULL,
		  entropy REAL, -- Делается необязательной
		  string_type TEXT NOT NULL CHECK (string_type IN ('string', 'high_entropy', 'regex', 'sus_word')), -- Добавляем тип строки
		  file_path TEXT NOT NULL,
		  FOREIGN KEY (static_result_id) REFERENCES static_results (id)
		);

      
      CREATE TABLE IF NOT EXISTS hardcoded_certs (
		  id INTEGER PRIMARY KEY AUTOINCREMENT,
		  static_result_id INTEGER NOT NULL,
		  type TEXT NOT NULL CHECK (type IN ('cert', 'keystore')),
		  file_path TEXT NOT NULL,
		  FOREIGN KEY (static_result_id) REFERENCES static_results (id)
		);
    `);

		// Таблица для проверки динамического анализа
		await db.exec(`
      CREATE TABLE IF NOT EXISTS secrets_found (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dynamic_result_id INTEGER NOT NULL,
        file_path TEXT NOT NULL,
        secret TEXT NOT NULL,
        comment TEXT,
        FOREIGN KEY (dynamic_result_id) REFERENCES dynamic_results (id)
      );
    `);

		console.log('Все таблицы успешно созданы или уже существуют.');
	} catch (error) {
		console.error('Ошибка при инициализации базы данных:', error);
	}
	// ох уж этот чатпгт...
	// } finally {
	// 	await db.close();
	// }

	return db;
}

