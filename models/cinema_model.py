from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from config import db_config
import oracledb
from datetime import datetime


tarefa_bp = Blueprint("tarefa", __name__)


def conexao():
    try:
        conn = oracledb.connect(**db_config)
        return conn
    except oracledb.Error as err:
        print(f"Erro ao conectar ao BD: {err}")
        return None

def cursor_dict(conn):
    cur = conn.cursor()
    def make_dict_cursor(cursor, row):
        return {desc[0].upper(): value for desc, value in zip(cursor.description, row)}
    cur.rowfactory = make_dict_cursor
    return cur


def get_all_tarefas():
    conn = conexao()
    if not conn:
        return []
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id, titulo, descricao, status, data_Criacao, prioridade, status FROM tarefas ORDER BY id ASC")
        columns = [col[0].lower() for col in cursor.description]
        data = [dict(zip(columns, row)) for row in cursor.fetchall()]
        return data
    finally:
        cursor.close()
        conn.close()


def get_tarefa_by_id(tarefa_id):
    conn = conexao()
    if not conn:
        return None
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, titulo, descricao, status, prioridade, data_criacao
            FROM tarefas
            WHERE id = :1
        """, (tarefa_id,))
        row = cursor.fetchone()
        if not row:
            return None
        columns = [col[0].lower() for col in cursor.description]
        return dict(zip(columns, row))
    finally:
        cursor.close()
        conn.close()


def edit_tarefas(tarefa_id, titulo=None, descricao=None, status=None, prioridade=None):

    conn = conexao()
    if not conn:
        return False

    try:
        cursor = cursor_dict(conn)

        cursor.execute("""
            SELECT id, titulo, descricao, status, prioridade
            FROM tarefas
            WHERE id = :1
        """, (tarefa_id,))
        tarefa_atual = cursor.fetchone()

        if not tarefa_atual:
            return False  

        titulo = titulo if titulo is not None else tarefa_atual['titulo']
        descricao = descricao if descricao is not None else tarefa_atual['descricao']
        status = status if status is not None else tarefa_atual['status']
        prioridade = prioridade if prioridade is not None else tarefa_atual.get('prioridade')

        update_query = """
            UPDATE tarefas
            SET titulo = :1,
                descricao = :2,
                status = :3,
                prioridade = :4
            WHERE id = :6
        """
        cursor.execute(update_query, (titulo, descricao, status, prioridade, tarefa_id))
        conn.commit()
        return True

    finally:
        cursor.close()
        conn.close()


def excluir_tarefas(tarefa_id):
    conn = conexao()
    if not conn:
        return False
    
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM tarefas WHERE id = :1", (tarefa_id,))
        conn.commit()
        return True
    except oracledb.Error as e:
        print(f"Erro ao excluir tarefa {tarefa_id}: {e}")
        return False
    finally:
        cursor.close()
        conn.close()


from datetime import datetime

def add_tarefa(titulo, descricao, prioridade, status="Pendente"):
    conn = conexao()
    if not conn:
        return False
    
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO tarefas (titulo, descricao, prioridade, status, data_criacao)
            VALUES (:1, :2, :3, :4, SYSDATE)
        """, (titulo, descricao, prioridade, status))
        
        conn.commit()
        return True
    except oracledb.Error as e:
        print(f"Erro ao adicionar tarefa: {e}")  # veja o erro real
        return False
    finally:
        cursor.close()
        conn.close()





def concluir_tarefa(tarefa_id):
    conn = conexao()
    if not conn:
        return False
    
    try:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE tarefas 
            SET status = 'Concluído'
            WHERE id = :1
        """, (tarefa_id,))
        conn.commit()
        return True
    except oracledb.Error as e:
        print(f"Erro ao concluir tarefa {tarefa_id}: {e}")
        return False
    finally:
        cursor.close()
        conn.close()
