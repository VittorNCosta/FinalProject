from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from config import db_config
import oracledb
from datetime import datetime

from models import cinema_model

cinema_bp = Blueprint("cinema", __name__)


@cinema_bp.route("/")
def home():
    dados = cinema_model.get_all_tarefas()
    return render_template("home.html", dados=dados)

@cinema_bp.route("/edit/<int:id>", methods=["GET", "POST"])
def edit(id):
    tarefa = cinema_model.get_tarefa_by_id(id)
    if not tarefa:
        flash("Tarefa não encontrada!", "error")
        return redirect(url_for("tarefa.home"))

    if request.method == "POST":
        titulo = request.form["titulo"]
        descricao = request.form["descricao"]
        status = request.form["status"]
        prioridade = request.form.get("prioridade")

        if cinema_model.edit_tarefas(id, titulo, descricao, status, prioridade):
            flash("Tarefa atualizada com sucesso!", "success")
        else:
            flash("Erro ao atualizar tarefa!", "error")
        return redirect(url_for("tarefa.home"))

    return render_template("edit.html", tarefa=tarefa)

@cinema_bp.route("/delete/<int:tarefa_id>", methods=["POST", "GET"])
def delete_tarefa(tarefa_id):
    sucesso = cinema_model.excluir_tarefas(tarefa_id)

    if sucesso:
        flash(f"Tarefa {tarefa_id} excluída com sucesso!", "success")
    else:
        flash(f"Erro ao excluir a tarefa {tarefa_id}.", "danger")

    return redirect(url_for("tarefa.home"))



@cinema_bp.route("/add", methods=["GET", "POST"])
def add_tarefa():
    if request.method == "POST":
        titulo = request.form.get("titulo")
        descricao = request.form.get("descricao")
        prioridade = request.form.get("prioridade")
        status = request.form.get("status", "Pendente")  
        sucesso = cinema_model.add_tarefa(titulo, descricao, prioridade, status)

        if sucesso:
            flash("Tarefa adicionada com sucesso!", "success")
            return redirect(url_for("tarefa.home"))
        else:
            flash("Erro ao adicionar tarefa.", "danger")

    return render_template("add.html")

@cinema_bp.route("/complete/<int:tarefa_id>")
def complete_tarefa(tarefa_id):
    sucesso = cinema_model.concluir_tarefa(tarefa_id)

    if sucesso:
        flash(f"Tarefa {tarefa_id} marcada como concluída!", "success")
    else:
        flash(f"Erro ao concluir tarefa {tarefa_id}.", "danger")

    return redirect(url_for("tarefa.home"))
